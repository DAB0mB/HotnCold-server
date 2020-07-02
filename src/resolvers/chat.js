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

    async chats(query, { limit, anchor }, { me }) {
      const { ChatUser } = useModels();

      let anchorBumpedAt = new Date();
      if (anchor) {
        const chatUser = await ChatUser.findOne({
          where: { userId: me.id, chatId: anchor },
          attributes: ['bumpedAt'],
        });

        if (chatUser) {
          anchorBumpedAt = chatUser.bumpedAt;
        }
      }

      return me.getChats({
        where: {
          isThread: { [Op.or]: [false, null] },
          bumpedAt: { [Op.lt]: anchorBumpedAt },
          isListed: true,
        },
        order: [['bumpedAt', 'DESC']],
        limit,
      });
    },

    async firstChat(query, args, { me }) {
      const [chat] = await me.getChats({
        where: {
          isThread: { [Op.or]: [false, null] },
          isListed: true,
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

      const [subscription] = await chat.getSubscriptions({
        limit: 1,
        where: { userId: me.id },
      });

      if (!subscription) {
        await ChatSubscription.create({
          chatId: chat.id,
          userId: me.id,
          isActive: true,
          isTest: myContract.isTest,
        });

        return true;
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
      if (chat.isThread) return null;

      const [recipient] = await chat.getUsers({
        where: {
          id: { [Op.ne]: me.id },
        },
        attributes: ['pictures']
      });

      if (!recipient) return null;

      return recipient.pictures[0];
    },

    async title(chat, args, { me }) {
      if (chat.isThread) return null;

      const users = await chat.getUsers({
        where: {
          id: { [Op.ne]: me.id },
        },
        attributes: ['name']
      });

      return users.length && users[0].name;
    },

    async recipient(chat, args, { me }) {
      if (chat.recipient) {
        return chat.recipient;
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
