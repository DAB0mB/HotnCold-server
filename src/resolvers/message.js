import { withFilter } from 'apollo-server';
import { Op } from 'sequelize';

import { useModels, usePubsub, useFirebase } from '../providers';

const resolvers = {
  Query: {
    async messages(query, { chatId, limit, anchor }) {
      const { Chat, Message } = useModels();

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
        order: [['createdAt', 'DESC']],
        limit,
      });

      return messages;
    },
  },

  Mutation: {
    async sendMessage(mutation, { chatId, text, image }, { me, myContract }) {
      if (!text && !image) {
        throw Error('Either message.text or message.image must be provided');
      }

      const { default: Resolvers } = require('.');
      const { Chat, ChatSubscription, Message, Status, User } = useModels();
      const firebase = useFirebase();
      const pubsub = usePubsub();

      const chat = await Chat.findOne({
        include: [{ model: Status }],
        where: { id: chatId },
      });

      if (!chat) {
        throw Error(`Provided chatId ${chatId} doesn't exist`);
      }

      // Create the message and associate it with me and target chat
      const message = new Message({
        text,
        image,
        chatId,
        userId: me.id,
        isTest: myContract.isTest,
        isMock: myContract.isMock,
      });
      await message.save();

      const users = await chat.getUsers({
        where: {
          id: { [Op.ne]: me.id },
        },
      });

      // For now, accumulate unread messages for private chats only
      if (!chat.isThread) {
        users.forEach((user) => {
          user.chats_users = {
            unreadMessagesIds: [message.id].concat(user.chats_users.unreadMessagesIds).filter(Boolean),
          };
        });
      }

      chat.bumpedAt = new Date();
      chat.isListed = true;

      await chat.save();
      await chat.setUsers([...users, me], {
        through: {
          isTest: myContract.isTest,
          unreadMessagesIds: [],
        }
      });

      if (chat.status) {
        await chat.status.addUser(me, {
          through: {
            isTest: myContract.isTest,
          },
        });
      }

      pubsub.publish('messageSent', {
        messageSent: message
      });

      pubsub.publish('chatBumped', {
        chatBumped: chat
      });

      const subscriptions = await chat.getSubscriptions({
        include: [
          {
            model: User,
            as: 'user',
          },
        ],
      });

      const newSubscriptions = users
        .filter((user) => {
          return !subscriptions.find(s => s.userId == user.id);
        })
        .map((user) => {
          const chatSubscription = new ChatSubscription({
            chatId: chat.id,
            userId: user.id,
            isActive: !chat.isThread,
            isTest: myContract.isTest,
          });

          chatSubscription.user = user;

          return chatSubscription;
        });

      if (newSubscriptions.length) {
        await chat.addSubscriptions(newSubscriptions);

        subscriptions.push(...newSubscriptions);
      }

      subscriptions
        .filter(s => s.isActive)
        .map(s => s.user).forEach(async (user) => {
          if (!user.notificationsToken) return;

          firebase.messaging().sendToDevice(user.notificationsToken, {
            data: {
              notificationId: `${chat.id}-${user.id}`,
              channelId: 'chat-messages',
              payload: JSON.stringify({
                data: {
                  isThread: !!chat.isThread,
                  statusId: chat.status?.id,
                  chatId,
                },
                body: message.text ? message.text : '📷 Image', // TODO: Multiline?
                ...(chat.isThread ? {
                  largeIcon: await me.ensureAvatar(),
                  title: `${me.name} (thread)`,
                } : {
                  largeIcon: await Resolvers.Chat.picture(chat, {}, { me: user }),
                  title: await Resolvers.Chat.title(chat, {}, { me: user }),
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
      resolve({ messageSent }) {
        const { Message } = useModels();

        return new Message(messageSent);
      },
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
      return loaders.user.load(message.userId);
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
