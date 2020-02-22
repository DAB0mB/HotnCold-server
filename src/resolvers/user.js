// import turfDistance from '@turf/distance';
import { UserInputError, withFilter } from 'apollo-server';
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

    async userProfile(query, { userId, randomMock, recentlyScanned }, { me, myContract }) {
      const { User } = useModels();

      // Return a random user mock if we're testing
      if (randomMock && myContract.isTest) {
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
        throw new UserInputError(`Argument 'userId' on Field 'userProfile' has an invalid value (${userId}). Expected type 'ID'.`);
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
    async createUser(mutation, { name, birthDate, occupation, bio, pictures }, { myContract }) {
      const pubsub = usePubsub();

      if (!myContract) {
        throw Error('Unauthorized');
      }

      const { User } = useModels();

      const user = await User.create({
        name,
        birthDate,
        occupation,
        bio,
        pictures,
      });

      await myContract.setUser(user);
      myContract.signed = true;
      await myContract.save();

      pubsub.publish('userCreated', {
        userCreated: user
      });

      return user.id;
    },

    async updateMyProfile(mutation, { name, birthDate, occupation, bio, pictures }, { me }) {
      await me.update({ name, birthDate, occupation, bio, pictures });

      return me;
    },

    async updateMyLocation(mutation, { location }, { me, myContract }) {
      const { Status, User } = useModels();

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
          statusId: { $ne: null },
          areaId: myArea.id,
          isMock: myContract.isTest ? true : { $ne: true },
          '$status.location$': { $ne: null },
          '$status.expiresAt$': { $gte: new Date() },
        },
        include: [{ model: Status, as: 'status' }],
        attributes: ['location', 'pictures', 'statusId', 'id'],
      });

      const features = nearbyUsers.map(user => ({
        type: 'Feature',
        properties: {
          userId: user.id,
          avatar: user.pictures[0],
          statusText: user.status.text,
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

    async associateNotificationsToken(mutations, { token }, { me }) {
      me.notificationsToken = token;
      await me.save();

      return true;
    },

    async dissociateNotificationsToken(mutations, args, { me }) {
      const hasToken = !!me.notificationsToken;

      if (!hasToken) {
        return false;
      }

      me.notificationsToken = null;
      await me.save();

      return true;
    },

    async makeDiscoverable(mutation, args, { me }) {
      if (me.discoverable) return;

      me.discoverable = true;
      await me.save();
    },

    async makeIncognito(mutation, args, { me }) {
      if (!me.discoverable) return;

      me.discoverable = false;
      await me.save();
    },
  },

  Subscription: {
    userCreated: {
      resolve({ userCreated }) {
        const { User } = useModels();

        return new User(userCreated);
      },
      subscribe: withFilter(
        () => usePubsub().asyncIterator('userCreated'),
        async ({ userCreated }, args, { me }) => {
          if (!me) return false;
          if (userCreated.id === me.id) return false;

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

    discoverable(user) {
      return !!user.discoverable;
    }
  },
};

export default resolvers;
