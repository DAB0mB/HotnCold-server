export default {
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
        chat = await Chat.build();
        await chat.addUsers([me, ...usersIds]);
      }

      return chat;
    },
  },

  Chat: {
    async recentMessage(chat, {}, { me }) {
      return chat.getMessages({ order: [['createdAt', 'DESC']], limit: 1 });
    },

    async users(chat, {}, { me }) {
      return chat.getUsers();
    },
  },
};
