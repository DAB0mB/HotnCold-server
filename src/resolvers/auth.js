import jwt from 'jsonwebtoken';

export default {
  Mutation: {
    async register(mutation, { firstName, lastName, birthDate, occupation, bio, pictures }, { models, res }) {
      const user = await models.User.create({
        firstName,
        lastName,
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

      return user;
    },
  },
};
