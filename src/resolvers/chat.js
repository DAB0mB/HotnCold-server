import { withFilter } from 'apollo-server';

import { useModels, usePubsub } from '../providers';

const resolvers = {
  Query: {
    async chats(query, args, { me }) {
      return me.getChats();
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
    async recentMessage(chat) {
      const messages = await chat.getMessages({ order: [['createdAt', 'DESC']], limit: 1 });

      return messages[0];
    },

    async firstMessage(chat) {
      const messages = await chat.getMessages({ order: [['createdAt', 'ASC']], limit: 1 });

      return messages[0];
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
