import { withFilter } from 'apollo-server';
import Sequelize from 'sequelize';

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

    async chats(query, args, { me }) {
      const { Chat, Message } = useModels();

      const myChats = await me.getChats();

      const myMessages = await Message.findAll({
        where: {
          chatId: { $in: myChats.map(c => c.id) },
        },
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('chatId')), 'chatId'],
        ],
      });

      return Chat.findAll({
        where: {
          id: { $in: myMessages.map(m => m.chatId) }
        }
      });
    }
  },

  Mutation: {
    async findOrCreateChat(mutation, { usersIds }, { me }) {
      const { Chat } = useModels();

      let chats = await Chat.findForUsers([me, ...usersIds], {
        attributes: ['id'],
      });

      let chat;
      for (let c of chats) {
        const users = await c.getUsers({
          attributes: ['id']
        });

        // Find a chat with specified IDs exclusively (including me)
        if (users.length == usersIds.length + 1) {
          chat = c;

          break;
        }
      }

      // Build chat if not found
      if (!chat) {
        chat = new Chat();
        await chat.save();
        await chat.addUsers([me, ...usersIds]);
      }

      return chat;
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

          const user = await chatBumped.getUsers({
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

      return user?.chats_users?.unreadMessagesIds?.length || 0;
    },

    recentMessages(chat) {
      return chat.getMessages({ order: [['createdAt', 'DESC']], limit: 12 });
    },

    async firstMessage(chat) {
      const messages = await chat.getMessages({ order: [['createdAt', 'ASC']], limit: 1 });

      return messages[0];
    },

    async picture(chat, args, { me }) {
      const [recipient] = await chat.getUsers({
        where: {
          id: { $ne: me.id },
        },
        attributes: ['pictures']
      });

      if (!recipient) return null;

      return recipient.pictures[0];
    },

    async title(chat, args, { me }) {
      const users = await chat.getUsers({
        where: {
          id: { $ne: me.id },
        },
        attributes: ['name']
      });

      return users.length && users[0].name;
    },

    users(chat) {
      return chat.getUsers();
    },
  },
};

export default resolvers;
