// import turfDistance from '@turf/distance';
import { UserInputError, withFilter } from 'apollo-server';
import jwt from 'jsonwebtoken';
import moment from 'moment';

import { useModels, usePubsub } from '../providers';

const resolvers = {
  Query: {
    me(query, args, { me }) {
      return me;
    },

    users(query, { usersIds }) {
      const { User } = useModels();

      return User.findAll({
        where: {
          id: { $in: usersIds },
        },
      });
    },

    async userProfile(query, { userId, randomMock, recentlyScanned }, { me }) {
      const { User } = useModels();

      // Return a random user mock if we're testing
      if (randomMock && /^ *__TEST__ *$/.test(me.name)) {
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
        throw new UserInputError('Argument \'userId\' on Field \'userProfile\' has an invalid value (1). Expected type \'ID\'.');
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
    async registerUser(mutation, { name, birthDate, occupation, bio, pictures }, { res }) {
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
          }
          else {
            resolve(token);
          }
        });
      });

      res.cookie('authToken', authToken);

      usePubsub().publish('userRegistered', {
        userRegistered: user
      });

      return user.id;
    },

    async updateMyProfile(mutation, { name, birthDate, occupation, bio, pictures }, { me }) {
      await me.update({ name, birthDate, occupation, bio, pictures });

      return me;
    },

    async updateMyLocation(mutation, { location }, { me }) {
      const { User } = useModels();

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
          isMock: /^ *__TEST__ *$/.test(me.name) ? true : { $ne: true },
        },
        attributes: ['location', 'id'],
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

  Subscription: {
    userRegistered: {
      resolve({ userRegistered }) {
        const { User } = useModels();

        return new User(userRegistered);
      },
      subscribe: withFilter(
        () => usePubsub().asyncIterator('userRegistered'),
        async ({ userRegistered }, args, { me }) => {
          if (!me) return false;
          if (userRegistered.id === me.id) return false;

          return true;
        },
      ),
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

export default resolvers;
