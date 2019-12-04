import { withFilter } from 'apollo-server';

import { useModels, usePubsub } from '../providers';

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
    async sendMessage(mutation, { chatId, text }, { me }) {
      const { Chat, Message } = useModels();

      const chat = await Chat.findOne({
        where: { id: chatId }
      });

      if (!chat) {
        throw Error(`Provided chatId ${chatId} doesn't exist`);
      }

      // Create the message and associate it with me and target chat
      const message = new Message({
        text,
        userId: me.id,
      });
      await message.save();
      await message.setChat(chat);

      usePubsub().publish('messageSent', {
        messageSent: message
      });

      return message;
    },
  },

  Subscription: {
    messageSent: {
      subscribe: withFilter(
        () => usePubsub().asyncIterator('messageSent'),
        async ({ messageSent }, { chatId }, { me }) => {
          const { Chat } = useModels();

          if (messageSent.chatId !== chatId) return false;

          const chat = await Chat.findOne({
            where: { id: chatId }
          });

          if (!chat) return false;

          const user = await chat.getUsers({
            where: { id: me.id }
          });

          if (!user) return false;

          return true;
        },
      ),
    },
  },

  Message: {
    user(message) {
      return message.getUser();
    },
  },
};
