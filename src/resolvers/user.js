import turfDistance from '@turf/distance';
import moment from 'moment';

import { useModels, useMapbox } from '../providers';

const resolvers = {
  Query: {
    me(query, args, { me }) {
      return me;
    },

    async userProfile(query, { userId }, { me }) {
      const { User } = useModels();

      if (!me) return null;

      const user = await User.findOne({
        where: { id: userId }
      });

      if (!user) return null;

      // TODO: Allow querying only with a certain proximity
      /*
      const distance = turfDistance(me.location, user.location, { units: 'kilometers' });

      // Users have to be at a certain proximity
      if (distance < 0.1) return null;
      */

      return user;
    },
  },

  Mutation: {
    async updateMyProfile(mutation, { firstName, lastName, birthDate, occupation, bio, pictures }, { me }) {
      await me.update({ firstName, lastName, birthDate, occupation, bio, pictures });

      return me;
    },

    async updateMyLocation(mutation, { location }, { me }) {
      const { User } = useModels();
      const mapbox = useMapbox();

      await me.setLocation(location);

      const myArea = await me.getArea();

      if (!myArea) {
        return {
          type: 'FeatureCollection',
          features: [],
        };
      }

      const nearbyUsers = await User.findAll({
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
    name(user, {}, { me }) {
      if (user.id === me.id) {
        return user.firstName + ' ' + user.lastName;
      }

      return user.firstName;
    },

    age(user) {
      return moment().year() - moment(user.birthDate).year();
    },

    avatar(user) {
      return user.pictures[0];
    },
  },
};

export default resolvers
