import { useModels } from '../providers';

export default {
  Query: {
    async messages(query, { chatId, anchor }, { me }) {
      const { Chat, Message } = useModels();

      const chat = await Chat.findOne({
        where: { id: chatId }
      });

      if (!chat) {
        return [];
      }

      let anchorCreatedAt = new Date(0);
      if (anchor) {
        const message = await Message.findOne({
          where: { id: anchor },
          attributes: ['createdAt'],
        });

        if (message) {
          anchorCreatedAt = message.createdAt;
        }
      }

      return chat.getMessages({
        where: {
          createdAt: { $gt: anchorCreatedAt }
        },
        order: [['createdAt', 'DESC']]
      });
    },
  },

  Mutation: {
    async sendMessage(mutation, { chatId, recipientId, text }, { me }) {
      const { Chat, Message } = useModels();

      let chat;
      // Create chat if not specified
      if (chatId) {
        chat = await Chat.findOne({
          where: { id: chatId }
        });

        if (!chat) return [];
      }
      else if (recipientId) {
        chat = await Chat.build();

        await chat.setUsers([me.id, recipientId]);
      }
      else {
        throw Error('Either "chatId" or "recipientId" must be specified');
      }

      // Create the message and associate it with me and target chat
      const message = await Message.build({
        text,
        userId: me.id,
      });
      await message.setChat(chat);

      return message;
    },
  },

  Message: {
    user(message) {
      return message.getUser();
    },
  },
};
