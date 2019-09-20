import models from '../models';

const { User } = models;

export default {
  Query: {
    me: (query, args, { me }) => {
      return me;
    },

    usersLocationsInMyArea: async (query, args, { me }) => {
      return mapbox.listFeatures({
        datasetId: me.locationDataset,
      }).send().then(({ body }) => body);
    },
  },

  Mutation: {
    updateUserLocation: async (mutation, { userId, location }, { me }) => {
      const user = await User.update({ location }, {
        where: { id: userId }
      });

      return user && user.toJSON();
    },
  },

  User: {
    age: (user, args) => {
      const birthYear = Number(user.birthDate.split('/').pop());
      const currentYear = new Date().getYear() + 1900;

      return currentYear - birthYear;
    },
  },
};
