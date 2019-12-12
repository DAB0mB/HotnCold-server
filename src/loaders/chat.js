import { useModels } from '../providers';

export const batchChats = async (keys) => {
  const { Chat } = useModels();

  const chats = await models.Chat.findAll({
    where: {
      id: {
        $in: keys,
      },
    },
  });

  return keys.map(key => chats.find(chat => chat.id === key));
};
