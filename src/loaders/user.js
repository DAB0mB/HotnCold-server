import { useModels } from '../providers';

export const batchUsers = async (keys) => {
  const { User } = useModels();

  const users = await models.User.findAll({
    where: {
      id: {
        $in: keys,
      },
    },
  });

  return keys.map(key => users.find(user => user.id === key));
};
