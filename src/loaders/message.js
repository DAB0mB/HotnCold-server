import { useModels } from '../providers';

export const batchMessages = async (keys) => {
  const { Message } = useModels();

  const messages = await Message.findAll({
    where: {
      id: keys,
    },
  });

  return keys.map(key => messages.find(message => message.id === key));
};
