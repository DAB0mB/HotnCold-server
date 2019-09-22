import * as mapbox from '../mapbox';
import models from '../models';

const { User } = models;

export default {
  Query: {
    me: (query, args, { me }) => {
      return me;
    },
  },

  Mutation: {
    updateMyLocation: async (mutation, { location }, { me }) => {
      if (!me) return null;

      await me.updateLocation(location);

      // Mapbox API seems to have a throttle - it will keep returning the same results
      // until a certain time has passed from recent request. If features don't seem like
      // they've been updated, don't panic
      return mapbox.datasets.listFeatures({
        datasetId: me.regionId,
      }).send().then(({ body }) => body);
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
