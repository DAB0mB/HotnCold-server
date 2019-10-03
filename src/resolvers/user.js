import turfDistance from '@turf/distance';
import moment from 'moment';

export default {
  Query: {
    me(query, args, { me }) {
      return me;
    },

    async user(query, { userId }, { me, models }) {
      if (!me) return null;

      const user = await models.User.findOne({
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
    updateMyProfile(mutation, { name, birthDate, occupation, bio }, { me, models }) {
      return models.User.update(
        { name, birthDate, occupation, bio },
        { where: { id: me.id } },
      );
    },

    async updateMyLocation(mutation, { location }, { me, mapbox }) {
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
    age(user) {
      return moment().year() - moment(user.birthDate).year();
    },

    area(user) {
      return user.getArea();
    },
  },
};
