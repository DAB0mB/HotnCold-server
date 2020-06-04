import { useModels } from '../providers';

export const batchUsers = async (keys) => {
  const { User } = useModels();

  const users = await User.findAll({
    where: {
      id: keys,
    },
  });

  return keys.map(key => users.find(user => user.id === key));
};
