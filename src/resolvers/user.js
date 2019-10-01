import turfDistance from '@turf/distance';

import * as mapbox from '../mapbox';
import models from '../models';

const { User } = models;

export default {
  Query: {
    me: (query, args, { me }) => {
      return me;
    },

    user: async (query, { userId }, { me }) => {
      if (!me) return null;

      const user = await User.findOne({
        where: { id: userId }
      });

      if (!user) return null;

      const distance = turfDistance(me.location, user.location, { units: 'kilometers' });

      // Users have to be at a certain proximity
      if (distance < 0.1) return null;

      return user;
    },
  },

  Mutation: {
    updateMyLocation: async (mutation, { location }, { me }) => {
      if (!me) return null;

      await me.setLocation(location);

      const myArea = await me.getArea();

      if (!myArea) {
        return {
          type: 'FeatureCollection',
          features: [],
        };
      };

      // Mapbox API seems to have a throttle - it will keep returning the same results
      // until a certain time has passed from recent request. If features don't seem like
      // they've been updated, don't panic
      return await mapbox.datasets.listFeatures({
        datasetId: myArea.datasetId,
      }).send().then(({ body }) => body);
    },
  },

  User: {
    age: (user) => {
      const birthYear = Number(user.birthDate.split('/').pop());
      const currentYear = new Date().getYear() + 1900;

      return currentYear - birthYear;
    },

    area: (user) => {
      return user.getArea();
    },
  },
};
