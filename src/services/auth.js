import jwt from 'jsonwebtoken';

import { useModels } from '../providers';

export const getMe = async (authToken) => {
  if (!authToken) return null;

  const { User } = useModels();

  const userId = await new Promise((resolve) => {
    jwt.verify(authToken, process.env.AUTH_SECRET, { algorithm: 'HS256' }, (err, id) => {
      if (err) {
        resolve();
      } else {
        resolve(id);
      }
    });
  });

  if (!userId) {
    return null;
  }

  return User.findOne({
    where: {
      id: userId,
    }
  });
};
