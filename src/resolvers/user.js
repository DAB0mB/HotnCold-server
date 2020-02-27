import { withFilter } from 'apollo-server';
import moment from 'moment';
import Sequelize from 'sequelize';

import { useModels, usePubsub } from '../providers';

const resolvers = {
  Query: {
    me(query, args, { me }) {
      return me;
    },

    async nearbyUsers(query, args, { me }) {
      const { Status, User } = useModels();

      const users = await User.findAll({
        where: {
          id: { $ne: me.id },
          areaId: me.areaId,
          discoverable: true,
          $or: [
            {
              isMock: true,
            },
            {
              $and: [
                {
                  locationExpiresAt: { $gte: new Date() },
                },
                Sequelize.where(Sequelize.fn('ST_Distance_Sphere', Sequelize.fn('ST_MakePoint', ...me.location.coordinates), Sequelize.col('user.location')), Sequelize.Op.lte, process.env.DISCOVERY_DISTANCE),
              ],
            },
          ],
        },
        include: [{ model: Status, as: 'status' }],
      });

      return users;
    },

    async userProfile(query, { userId }, { me }) {
      const { Status, User } = useModels();

      if (userId == me.id) {
        return me;
      }

      const user = await User.findOne({
        where: {
          id: userId,
          $or: [
            {
              isMock: true,
            },
            {
              $and: [
                {
                  locationExpiresAt: { $gte: new Date() },
                },
                Sequelize.where(Sequelize.fn('ST_Distance_Sphere', Sequelize.fn('ST_MakePoint', ...me.location.coordinates), Sequelize.col('user.location')), Sequelize.Op.lte, process.env.DISCOVERY_DISTANCE),
              ],
            },
          ],
        },
        include: [{ model: Status, as: 'status' }],
      });

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

    async updateMyLocation(mutation, { location: coordinates }, { me, myContract }) {
      const { Status, User } = useModels();

      await me.setLocation(coordinates);

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
          isMock: myContract.isTest ? true : { $ne: true },
          $or: [
            {
              statusId: { $ne: null }
            },
            {
              discoverable: true,
            },
          ],
        },
        include: [{
          model: Status,
          as: 'status',
          where: {
            areaId: myArea.id,
            locationExpiresAt: { $gte: new Date() },
          },
          attributes: [
            'text',
            'location',
            'locationExpiresAt',
            [Sequelize.fn('ST_Distance_Sphere', Sequelize.fn('ST_MakePoint', ...coordinates), Sequelize.col('status.location')), 'distance'],
          ],
        }],
        attributes: [
          'id',
          'pictures',
          'isMock',
          'location',
          'locationExpiresAt',
        ],
        // Using literal because I couldn't find an alternative. The proper solution should be so:
        // https://github.com/sequelize/sequelize/issues/4553#issuecomment-142221005
        order: [[Sequelize.literal('"status.distance"'), 'ASC NULLS LAST']],
      });

      const features = [];

      nearbyUsers.forEach((user) => {
        if (user.status && user.status.location && new Date(user.status.locationExpiresAt) > new Date()) {
          const feature = {
            type: 'Feature',
            geometry: user.status.location,
          };

          if (user.isMock || user.status.distance < process.env.DISCOVERY_DISTANCE) {
            feature.properties = {
              userId: user.id,
              avatar: user.pictures[0],
              statusText: user.status.text,
            };
          }

          features.push(feature);
        }

        if (user.discoverable && user.location && new Date(user.locationExpiresAt) > new Date()) {
          features.push({
            type: 'Feature',
            geometry: user.location,
          });
        }
      });

      return {
        type: 'FeatureCollection',
        features,
      };
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

      if (!me.statusId) {
        throw Error('Cannot make you discoverable if a status wasn\'t yet created');
      }

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
    location(user) {
      if (!user.location) return null;
      if (new Date(user.locationExpiresAt) < new Date()) return null;

      return user.location.coordinates;
    },

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
