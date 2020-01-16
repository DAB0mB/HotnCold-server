import { withFilter } from 'apollo-server';

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

      return chat.getMessages({
        where: {
          createdAt: { $lt: anchorCreatedAt }
        },
        order: [['createdAt', 'DESC']],
        limit,
      });
    },
  },

  Mutation: {
    async sendMessage(mutation, { chatId, text }, { me }) {
      const { default: Resolvers } = require('.');
      const { Chat, Message } = useModels();
      const firebase = useFirebase();
      const pubsub = usePubsub();

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

      pubsub.publish('messageSent', {
        messageSent: message
      });

      pubsub.publish('chatBumped', {
        chatBumped: chat
      });

      const users = await chat.getUsers({
        where: {
          id: { $ne: me.id },
        },
      });

      users.forEach(async (user) => {
        if (!user.notificationsToken) return;

        firebase.messaging().sendToDevice(user.notificationsToken, {
          data: {
            channelId: 'chat-messages',
            props: JSON.stringify({
              data: { chatId },
              largeIcon: await Resolvers.Chat.picture(chat, {}, { me: user }),
              title: await Resolvers.Chat.title(chat, {}, { me: user }),
              body: text,
            }),
          },
        });
      });

      // Run in background
      // Send an echo message back
      (async function () {
        const match = text.toLowerCase().match(/^echo( *\d+)?$/);

        if (!match) return;

        const recipients = await chat.getUsers({
          where: {
            id: { $ne: me.id },
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

export default resolvers;
