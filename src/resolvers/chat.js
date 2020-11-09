import { withFilter } from 'apollo-server';
import { Op } from 'sequelize';

import { lazyLimit } from '../consts';
import { useModels, usePubsub } from '../providers';

const resolvers = {
  Query: {
    async chat(query, { chatId }, { me }) {
      const myChats = await me.getChats({
        where: {
          id: chatId
        }
      });

      return myChats[0] || null;
    },

    async chats(query, { limit, anchor, includeThreads }, { db, me }) {
      const { Chat } = useModels();

      let anchorBumpedAt = new Date();
      if (anchor) {
        const chat = await Chat.findOne({
          where: { id: anchor },
          attributes: ['bumpedAt'],
        });

        if (chat) {
          anchorBumpedAt = chat.bumpedAt;
        }
      }

      const chats = await me.getChats({
        where: {
          bumpedAt: { [Op.lt]: anchorBumpedAt },
          isListed: true,
          ...(includeThreads ? {} : {
            isThread: { [Op.or]: [false, null] },
          }),
        },
        order: [['bumpedAt', 'DESC']],
        limit,
      });

      await Promise.all(chats.map(async (chat) => {
        chat.recipient = await resolvers.Chat.recipient(chat, {}, { db, me });
      }));

      return chats;
    },

    async firstChat(query, { includeThreads }, { me }) {
      const [chat] = await me.getChats({
        where: {
          isListed: true,
          ...(includeThreads ? {} : {
            isThread: { [Op.or]: [false, null] },
          }),
        },
        order: [['bumpedAt', 'ASC']],
        limit: 1,
      });

      return chat || null;
    },

    async participants(query, { chatId, limit, anchor }) {
      const { Chat, ChatUser } = useModels();

      const chat = await Chat.findOne({
        where: { id: chatId },
      });

      if (!chat) {
        return [];
      }

      let anchorCreatedAt = new Date(0);
      if (anchor) {
        const user = await ChatUser.findOne({
          where: { chatId, userId: anchor },
          attributes: ['createdAt'],
        });

        if (user) {
          anchorCreatedAt = user.createdAt;
        }
      }

      const users = await chat.getUsers({
        through: {
          where: {
            createdAt: { [Op.gt]: anchorCreatedAt },
          },
        },
        limit,
        order: [['createdAt', 'DESC']],
      });

      return users;
    },

    async firstParticipant(query, { chatId }) {
      const { Chat } = useModels();

      const [user] = await new Chat({ id: chatId }).getUsers({
        limit: 1,
        order: [['createdAt', 'ASC']],
      });

      if (!user) return null;

      return user;
    },
  },

  Mutation: {
    async findOrCreateChat(mutation, { usersIds }, { me, myContract }) {
      const { Chat } = useModels();
      const recipientId = usersIds[0];

      let chat = await Chat.findPrivateChat(me, recipientId);

      // Build chat if not found
      if (!chat) {
        chat = new Chat();
        chat.isTest = myContract.isTest;
        await chat.save();
        await chat.addUsers([me, recipientId], {
          through: {
            isTest: myContract.isTest,
          },
        });
      }

      return chat;
    },

    findOrCreateChat_2(mutation, { recipientId }, context) {
      return resolvers.Mutation.findOrCreateChat(mutation, { usersIds: [recipientId] }, context);
    },

    async markChatAsRead(mutation, { chatId }, { me }) {
      const { ChatUser } = useModels();

      const [updateCount] = await ChatUser.update({
        unreadMessagesIds: [],
      }, {
        where: { chatId, userId: me.id },
      });

      return !!updateCount;
    },

    async toggleChatSubscription(mutation, { chatId }, { me, myContract }) {
      const { Chat, ChatSubscription } = useModels();

      const chat = await Chat.findOne({
        where: { id: chatId },
      });

      if (!chat) {
        throw Error('Chat not found!');
      }

      let [subscription] = await chat.getSubscriptions({
        limit: 1,
        where: { userId: me.id },
      });

      if (!subscription) {
        subscription = new ChatSubscription({
          chatId: chat.id,
          userId: me.id,
          isActive: true,
          isTest: myContract.isTest,
        });
      }

      subscription.isActive = !subscription.isActive;
      await subscription.save();

      return subscription.isActive;
    },
  },

  Subscription: {
    chatBumped: {
      resolve({ chatBumped }) {
        const { Chat } = useModels();

        return new Chat(chatBumped);
      },
      subscribe: withFilter(
        () => usePubsub().asyncIterator('chatBumped'),
        async ({ chatBumped }, args, { me }) => {
          const { Chat } = useModels();

          if (!me) return false;

          chatBumped = new Chat(chatBumped);

          const [user] = await chatBumped.getUsers({
            where: { id: me.id }
          });

          if (!user) return false;

          return true;
        },
      ),
    },
  },

  Chat: {
    async unreadMessagesCount(chat, args, { me }) {
      const [user] = await chat.getUsers({
        where: { id: me.id },
      });

      return user?.chats_users?.dataValues?.unreadMessagesIds?.length || 0;
    },

    recentMessages(chat) {
      return chat.getMessages({ order: [['createdAt', 'DESC']], limit: lazyLimit });
    },

    async firstMessage(chat) {
      const messages = await chat.getMessages({ order: [['createdAt', 'ASC']], limit: 1 });

      return messages[0];
    },

    async picture(chat, args, { me }) {
      if (chat.isThread) {
        const status = await chat.getStatus({
          attributes: ['images']
        });

        if (!status) return null;

        return status.images?.[0];
      }
      else {
        const [recipient] = await chat.getUsers({
          where: {
            id: { [Op.ne]: me.id },
          },
          attributes: ['pictures']
        });

        if (!recipient) return null;

        return recipient.pictures[0];
      }
    },

    async title(chat, args, { me }) {
      let recipient = chat.recipient;

      if (!recipient) {
        const users = await chat.getUsers({
          where: {
            id: { [Op.ne]: me.id },
          },
          attributes: ['name']
        });

        recipient = users[0];
      }


      if (!recipient) return null;

      if (chat.isThread) {
        return recipient.name + '\'s status';
      }

      return recipient.name;
    },

    async recipient(chat, args, { db, me }) {
      const { User } = useModels();

      if (chat.recipient) {
        return chat.recipient;
      }

      if (chat.isThread) {
        const [recipient] = await db.map(`
          SELECT users.*
          FROM (
            SELECT statuses_users."userId"
            FROM (
              SELECT statuses.id
              FROM statuses
              INNER JOIN chats
              ON chats.id = $(chatId)
              WHERE chats.id = statuses."chatId"
            ) AS statuses
            INNER JOIN statuses_users
            ON statuses_users."statusId" = statuses.id
            WHERE statuses_users."isAuthor" IS TRUE
          ) AS statuses
          INNER JOIN users
          ON users.id = statuses."userId"
        `, {
          chatId: chat.id,
        }, (u) => {
          return new User(u);
        });

        return recipient;
      }

      const users = await chat.getUsers({
        where: {
          id: { [Op.ne]: me.id },
        },
      });

      return users[0];
    },

    participantsCount(chat) {
      return chat.countUsers();
    },

    isThread(chat) {
      return !!chat.isThread;
    },

    async subscribed(chat, args, { me }) {
      return !!await chat.countSubscriptions({
        limit: 1,
        where: {
          userId: me.id,
          isActive: true,
        },
      });
    },
  },
};

export default resolvers;
