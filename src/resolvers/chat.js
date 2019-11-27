export default {
  Chat: {
    async recentMessage(chat, {}, { me }) {
      return chat.getMessages({ order: [['createdAt', 'DESC']], limit: 1 });
    },

    async users(chat, {}, { me }) {
      return chat.getUsers();
    },
  },
};
