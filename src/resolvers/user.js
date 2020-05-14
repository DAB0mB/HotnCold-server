import { withFilter } from 'apollo-server';
import moment from 'moment';
import Sequelize from 'sequelize';

import { useCloudinary, useModels, usePubsub } from '../providers';
import { omit } from '../utils';

const resolvers = {
  Query: {
    me(query, args, { me }) {
      return me;
    },

    async userProfile(query, { userId }, { me }) {
      const { User } = useModels();

      if (userId == me.id) {
        return me;
      }

      const user = await User.findOne({
        where: {
          id: userId,
        },
      });

      return user;
    },
  },

  Mutation: {
    async createUser(mutation, { name, birthDate, occupation, bio, pictures }, { myContract }) {
      const cloudinary = useCloudinary();
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
        avatar: pictures[0] ? await cloudinary.uploadFromUrl(pictures[0], { upload_preset: 'avatar-pic' }) : null,
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
      const cloudinary = useCloudinary();

      const avatar = pictures[0] === me.pictures[0]
        ? me.avatar
        : pictures.length
          ? await cloudinary.uploadFromUrl(pictures[0], { upload_preset: 'avatar-pic' })
          : null;

      await me.update({
        name,
        birthDate,
        occupation,
        bio,
        pictures,
        avatar,
      });

      return me;
    },

    // TODO: Split features fetching to a separate query
    async updateMyLocation(mutation, { location: coordinates, featuredAt }, { me, myContract }) {
      const { default: Resolvers } = require('.');
      const { Event, Status, User } = useModels();

      await me.setLocation(coordinates);

      const myArea = await me.getArea();

      if (!myArea) {
        return {
          type: 'FeatureCollection',
          properties: {
            timezone: null,
          },
          features: [],
        };
      }

      const featuredTomorrow = moment(featuredAt).add(1, 'day').toDate();
      const now = moment().toDate();
      const featuredNow = featuredAt > now ? featuredAt : now;

      if (featuredTomorrow < now) {
        throw Error('Given day cannot be in the past');
      }

      const features = [];

      {
        const statuses = await Status.findAll({
          where: {
            areaId: myArea.id,
            userId: { $ne: null },
            ...(myContract.isTest ? {
              $or: [
                {
                  isMock: true,
                },
                {
                  userId: me.id,
                  publishedAt: {
                    $gte: featuredAt,
                    $lt: featuredTomorrow,
                  },
                },
              ]
            } : {
              isMock: { $or: [false, null] },
              isTest: { $or: [false, null] },
              publishedAt: {
                $gte: featuredAt,
                $lt: featuredTomorrow,
              },
            }),
            $and: [
              Sequelize.where(Sequelize.fn('ST_DWithin', Sequelize.cast(Sequelize.fn('ST_MakePoint', ...myArea.center.coordinates), 'geography'), Sequelize.col('status.location'), process.env.MAP_DISCOVERY_DISTANCE), true),
            ],
          },
          include: [{ model: User, as: 'user' }],
        });

        await statuses.reduce(async (creatingFeature, status) => {
          await creatingFeature;

          const feature = {
            type: 'Feature',
            geometry: status.location,
            properties: {
              type: 'status',
              user: {
                id: status.userId,
                name: status.user.name,
                avatar: await status.user.ensureAvatar(),
              },
              status: {
                id: status.id,
                text: status.text,
              },
            },
          };

          features.push(feature);
        }, Promise.resolve());
      }

      const events = await Event.findAll({
        where: {
          areaId: myArea.id,
          $or: [
            {
              startsAt: {
                $gte: featuredNow,
                $lt: featuredTomorrow,
              },
            },
            {
              endsAt: {
                $gte: featuredNow,
                $lt: featuredTomorrow,
              },
            },
          ],
        },
        // TODO: Properly count
        include : [
          {
            model: User,
            as: 'attendees',
            attributes: ['id'],
          },
        ],
        attributes: [
          'id',
          'name',
          'category',
          'featuredPhoto',
          'sourceAttendanceCount',
          'location',
          'startsAt',
        ],
      });

      events.forEach((event) => {
        const hncAttendanceCount = event.dataValues.attendees.length;
        // Required for upcoming resolution
        event.area = myArea;

        const eventFeature = {
          type: 'Feature',
          properties: {
            type: 'event',
            event: {
              ...omit(event.dataValues, 'location'),
              localTime: Resolvers.Event.localTime(event),
              localDate: Resolvers.Event.localDate(event),
              attendanceCount: event.dataValues.sourceAttendanceCount + hncAttendanceCount,
            },
          },
          geometry: event.location,
        };

        features.push(eventFeature);
      });

      return {
        type: 'FeatureCollection',
        properties: {
          timezone: myArea.timezone,
        },
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

    area(user) {
      return user.getArea();
    },

    age(user) {
      return user.birthDate && moment().diff(user.birthDate, 'years');
    },

    pictures(user) {
      return user.pictures || [];
    },

    avatar(user) {
      return user.ensureAvatar();
    },
  },
};

export default resolvers;
