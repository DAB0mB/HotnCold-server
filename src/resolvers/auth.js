import jwt from 'jsonwebtoken';

import { useModels } from '../providers';

const resolvers = {
  Mutation: {
    async register(mutation, { name, birthDate, occupation, bio, pictures }, { res }) {
      const { User } = useModels();

      const user = await User.create({
        name,
        birthDate,
        occupation,
        bio,
        pictures,
      });

      const authToken = await new Promise((resolve, reject) => {
        jwt.sign(user.id, process.env.AUTH_SECRET, { algorithm: 'HS256' }, (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        });
      });

      res.cookie('authToken', authToken);

      return user.id;
    },
  },
};

export default resolvers;
