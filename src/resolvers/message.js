import { withFilter } from 'apollo-server';
import { Op } from 'sequelize';
import uuid from 'uuid';

import { useDb, useModels, usePubsub, useFirebase } from '../providers';

const resolvers = {
  Query: {
    async messages(query, { chatId, limit, anchor }) {
      const { Chat, Message, User } = useModels();

      const chat = await Chat.findOne({
        where: { id: chatId }
      });

      if (!chat) {
        return [];
      }

      let anchorCreatedAt = new Date();
      if (anchor) {
        const message = await Message.findOne({
          where: { id: anchor },
          attributes: ['createdAt'],
        });

        if (message) {
          anchorCreatedAt = message.createdAt;
        }
      }

      const messages = await chat.getMessages({
        where: {
          createdAt: { [Op.lt]: anchorCreatedAt }
        },
        include: [
          {
            model: User,
            as: 'user',
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
      });

      return messages;
    },
  },

  Mutation: {
    async sendMessage(mutation, { chatId, text, image }, { db, me, myContract }) {
      if (!text && !image) {
        throw Error('Either message.text or message.image must be provided');
      }

      const { Chat, Message, Status } = useModels();
      const firebase = useFirebase();
      const pubsub = usePubsub();

      const chat = await Chat.findOne({
        where: { id: chatId },
      });

      if (!chat) {
        throw Error(`Provided chatId ${chatId} doesn't exist`);
      }

      let message;

      await db.tx(t => {
        const queries = [];
        const now = new Date();

        message = new Message({}, { isNewRecord: false }).set({
          id: uuid(),
          text,
          image,
          chatId,
          userId: me.id,
          isTest: myContract.isTest,
          isMock: myContract.isMock,
          createdAt: now,
          updatedAt: now,
        }, { raw: true });

        message.chat = chat;
        message.user = me;

        queries.push(db.none(`
          INSERT INTO messages(id, text, image, "chatId", "userId", "isTest", "isMock", "createdAt", "updatedAt")
          VALUES($(id), $(text), $(image), $(chatId), $(userId), $(isTest), $(isMock), $(now), $(now))
        `, {
          ...message.dataValues,
          now,
        }));

        queries.push(db.none(`
          UPDATE chats
          SET "bumpedAt" = $(now), "isListed" = 't'
          WHERE id = $(chatId)
        `, {
          now,
          chatId: chat.id,
        }));

        queries.push(db.none(`
          INSERT INTO chats_users("chatId", "userId", "isTest", "unreadMessagesIds", "createdAt", "updatedAt")
          SELECT $(chatId), $(myId), $(isTest), '{}', $(now), $(now)
          WHERE NOT EXISTS (
            SELECT 1
            FROM chats_users
            WHERE "chatId" = $(chatId) AND "userId" = $(myId)
            LIMIT 1
          )
        `, {
          now,
          chatId: chat.id,
          myId: me.id,
          isTest: myContract.isTest,
        }));

        queries.push(db.none(`
          UPDATE chats_users
          SET ("unreadMessagesIds", "updatedAt") = (array[$(newMessageId)::uuid] || "unreadMessagesIds", $(now))
          WHERE "chatId" = $(chatId) AND "userId" != $(myId)
        `, {
          now,
          chatId: chat.id,
          myId: me.id,
          newMessageId: message.id,
        }));

        queries.push(db.none(`
          UPDATE chats_users
          SET ("unreadMessagesIds", "updatedAt") = ('{}', $(now))
          WHERE "chatId" = $(chatId) AND "userId" = $(myId)
        `, {
          now,
          chatId: chat.id,
          myId: me.id,
        }));

        queries.push(db.none(`
          INSERT INTO chats_subscriptions("id", "userId", "chatId", "isTest", "isActive", "createdAt", "updatedAt")
          SELECT $(id), $(userId), $(chatId), $(isTest), $(isActive), $(now), $(now)
          WHERE NOT EXISTS (
            SELECT 1
            FROM chats_subscriptions
            WHERE "chatId" = $(chatId) AND "userId" = $(userId)
            LIMIT 1
          )
        `, {
          id: uuid(),
          now,
          chatId: chat.id,
          userId: me.id,
          isTest: myContract.isTest,
          isActive: true,
        }));

        if (chat.isThread) {
          queries.push(db.none(`
            INSERT INTO statuses_users("statusId", "userId", "isTest", "createdAt", "updatedAt")
            SELECT statuses.id, $(myId), $(isTest), $(now), $(now)
            FROM statuses
            WHERE statuses."chatId" = $(chatId) AND NOT EXISTS (
              SELECT 1
              FROM statuses_users
              WHERE statuses_users."statusId" = statuses.id AND statuses_users."userId" = $(myId)
              LIMIT 1
            )
            LIMIT 1
          `, {
            now,
            chatId: chat.id,
            myId: me.id,
            isTest: myContract.isTest,
          }));
        }

        return t.batch(queries);
      });

      pubsub.publish('messageSent', {
        messageSent: message
      });

      pubsub.publish('chatBumped', {
        chatBumped: chat
      });

      const subscriptions = await db.any(`
        SELECT DISTINCT ON("userId") *
        FROM (
          SELECT chats_subscriptions.id, chats_subscriptions."chatId", chats_subscriptions."userId", chats_subscriptions."isActive", statuses.id as "statusId", users."notificationsToken" as "userNotificationsToken", chats."isThread", statuses.thumb as "statusThumb", statuses.images as "statusImages", recipients.id as "recipientId", recipients.avatar as "recipientAvatar", recipients.pictures as "recipientPictures", recipients.name as "recipientName"
          FROM chats_subscriptions
          INNER JOIN chats
          ON chats.id = chats_subscriptions."chatId"
          INNER JOIN users
          ON users.id = chats_subscriptions."userId"
          LEFT JOIN statuses
          ON statuses."chatId" = chats.id
          LEFT JOIN statuses_users
          ON statuses_users."statusId" = statuses.id AND statuses_users."isAuthor" IS TRUE
          LEFT JOIN chats_users
          ON chats_users."chatId" = chats.id AND chats."isThread" IS NOT TRUE AND chats_users."userId" != $(myId)
          LEFT JOIN users AS recipients
          ON recipients.id = chats_users."userId" OR recipients.id = statuses_users."userId"
          WHERE users."notificationsToken" IS NOT NULL AND users."notificationsToken" != '' AND chats_subscriptions."chatId" = $(chatId)
          ORDER BY chats_subscriptions."updatedAt" DESC
        ) rows;
      `, {
        myId: me.id,
        chatId: chat.id,
      });

      subscriptions.forEach(async ({ isActive, chatId, userId, statusId, userNotificationsToken, isThread, statusThumb, statusImages, recipientName }) => {
        if (!isActive) return;

        firebase.messaging().sendToDevice(userNotificationsToken, {
          data: {
            notificationId: `${chatId}-${userId}`,
            channelId: 'chat-messages',
            payload: JSON.stringify({
              data: {
                isThread: !!isThread,
                statusId,
                chatId,
              },
              body: message.text ? message.text : '📷 Media', // TODO: Multiline?
              ...(isThread ? {
                largeIcon: await new Status({}, { isNewRecord: false }).set({ id: statusId, thumb: statusThumb, images: statusImages }, { raw: true }).ensureThumb(),
                title: `${recipientName}'s status`,
              } : {
                largeIcon: await me.ensureAvatar(),
                title: me.name,
              }),
            }),
          },
        });
      });

      // Run in background
      // Send an echo message back after X amount of seconds
      (async function () {
        if (!text) return;

        const match = text.toLowerCase().match(/^echo( *\d+)?$/);

        if (!match) return;

        const recipients = await chat.getUsers({
          where: {
            id: { [Op.ne]: me.id },
            isMock: true,
          },
        });

        if (!recipients.length) return;

        const ms = Math.max((match[1] || 1) * 1000, 1000);

        setTimeout(() => {
          recipients.forEach((recipient) => {
            resolvers.Mutation.sendMessage(mutation, {
              chatId,
              text: 'echo',
            }, {
              // Connection will be disposed by the time we get here, thus we use the pool
              db: useDb(),
              me: recipient,
              myContract: { isMock: true },
            });
          });
        }, ms);
      })();

      return message;
    },
  },

  Subscription: {
    messageSent: {
      subscribe: withFilter(
        () => usePubsub().asyncIterator('messageSent'),
        async ({ messageSent }, { chatId }, { me }) => {
          const { Chat } = useModels();

          if (!me) return false;
          if (messageSent.chatId !== chatId) return false;

          const chat = await Chat.findOne({
            where: { id: chatId }
          });

          if (!chat) return false;

          const [user] = await chat.getUsers({
            where: { id: me.id }
          });

          if (!user) return false;

          return true;
        },
      ),
    },
  },

  Message: {
    user(message, args, { loaders }) {
      return message.user || loaders.user.load(message.userId);
    },

    pending() {
      return false;
    },

    sent() {
      return true;
    },
  },
};

export default resolvers;
