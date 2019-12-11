import turfDistance from '@turf/distance';
import { UserInputError } from 'apollo-server';
import moment from 'moment';

import { useModels, useMapbox } from '../providers';

const resolvers = {
  Query: {
    me(query, args, { me }) {
      return me;
    },

    async userProfile(query, { userId, randomMock, recentlyScanned }, { me }) {
      const { User } = useModels();

      // Return a random user mock if we're testing
      if (randomMock && me.name == '__TEST__') {
        const myArea = await me.getArea();

        if (!myArea) {
          return null;
        }

        const user = await User.findOne({
          where: {
            areaId: myArea.id,
            isMock: true,
          },
        });

        return user;
      }

      if (!userId) {
        throw new UserInputError("Argument 'userId' on Field 'userProfile' has an invalid value (1). Expected type 'ID'.")
      }

      if (userId == me.id) {
        return me;
      }

      const userQuery = {
        id: userId,
      };

      if (recentlyScanned) {
        userQuery.recentlyScannedAt = {
          $gt: new Date(Date.now() - process.env.ACTIVE_TIME)
        };
      }

      const user = await User.findOne({
        where: userQuery,
      });

      if (!user || !user.recentlyScannedAt) return null;

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
    async updateMyProfile(mutation, { name, birthDate, occupation, bio, pictures }, { me }) {
      await me.update({ name, birthDate, occupation, bio, pictures });

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
          isMock: me.name == '__TEST__' ? true : { $ne: true },
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

    async updateRecentScanTime(mutation, { clear }, { me }) {
      me.recentlyScannedAt = clear ? null : new Date();
      await me.save();

      return me.recentlyScannedAt;
    },
  },

  User: {
    age(user) {
      return moment().year() - moment(user.birthDate).year();
    },

    avatar(user) {
      return user.pictures[0];
    },
  },
};

export default resolvers
