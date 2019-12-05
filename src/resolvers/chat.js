import { useModels } from '../providers';

const resolvers = {
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

  Chat: {
    async recentMessage(chat) {
      const messages = await chat.getMessages({ order: [['createdAt', 'DESC']], limit: 1 });

      return messages[0];
    },

    async firstMessage(chat) {
      const messages = await chat.getMessages({ order: [['createdAt', 'ASC']], limit: 1 });

      return messages[0];
    },

    users(chat) {
      return chat.getUsers();
    },
  },
};

export default resolvers;
