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
    async updateMyProfile(mutation, { firstName, lastName, birthDate, occupation, bio, pictures }, { me, models }) {
      await me.update({ firstName, lastName, birthDate, occupation, bio, pictures });

      return me;
    },

    async updateMyLocation(mutation, { location }, { me, mapbox, models }) {
      await me.setLocation(location);

      const myArea = await me.getArea();

      if (!myArea) {
        return {
          type: 'FeatureCollection',
          features: [],
        };
      }

      const nearbyUsers = await models.User.findAll({
        where: {
          id: { $ne: me.id },
          areaId: myArea.id,
        },
        attributes: ['location'],
      });

      const features = nearbyUsers.map(user => ({
        type: 'Feature',
        properties: {
          userId: user.id,
        },
        geometry: {
          type: 'Point',
          coordinates: user.location,
        },
      }));

      return {
        type: 'FeatureCollection',
        features,
      };
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
