import { useModels } from '../providers';

export const batchChats = async (keys) => {
  const { Chat } = useModels();

  const chats = await Chat.findAll({
    where: {
      id: keys,
    },
  });

  return keys.map(key => chats.find(chat => chat.id === key));
};
