import { withFilter } from 'apollo-server';
import moment from 'moment';
import Sequelize from 'sequelize';

import { useCloudinary, useMeetup, useModels, usePubsub } from '../providers';
import { kilometersToMiles } from '../utils';

const resolvers = {
  Query: {
    me(query, args, { me }) {
      return me;
    },

    async nearbyUsers(query, args, { me, myContract }) {
      const { Status, User } = useModels();

      const users = await User.findAll({
        where: {
          id: { $ne: me.id },
          areaId: me.areaId,
          discoverable: true,
          ...(myContract.isTest ? {
            isMock: true,
          } : {
            isMock: { $or: [false, null] },
            $and: [
              {
                locationExpiresAt: { $gte: new Date() },
              },
              // ST_DWithin uses spatial indexes, unlike ST_Distance_Sphere
              // false is the right return value I have no idea why... I think it might be related to Sequelize
              Sequelize.where(Sequelize.fn('ST_DWithin', Sequelize.cast(Sequelize.fn('ST_MakePoint', ...me.location.coordinates), 'geography'), Sequelize.col('user.location'), process.env.RADAR_DISCOVERY_DISTANCE), false),
            ]
          }),
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
        },
        include: [{ model: Status, as: 'status' }],
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
        avatar: await cloudinary.uploadFromUrl(pictures[0], { upload_preset: 'avatar-pic' }),
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
        : await cloudinary.uploadFromUrl(pictures[0], { upload_preset: 'avatar-pic' });

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

    async updateMyLocation(mutation, { location: coordinates }, { me, myContract }) {
      const { Status, User } = useModels();
      const meetup = useMeetup();

      await me.setLocation(coordinates);

      const myArea = await me.getArea();

      if (!myArea) {
        return {
          type: 'FeatureCollection',
          features: [],
        };
      }

      // Unlike nearbyUsers resolver, this will query based on statuses
      const nearbyUsers = await User.findAll({
        where: {
          id: { $ne: me.id },
          isMock: myContract.isTest ? true : { $or: [false, null] },
          statusId: { $ne: null },
          $and: [
            Sequelize.where(Sequelize.fn('ST_DWithin', Sequelize.cast(Sequelize.fn('ST_MakePoint', ...myArea.center.coordinates), 'geography'), Sequelize.col('user.location'), process.env.MAP_DISCOVERY_DISTANCE), true),
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
            'id',
            'updatedAt',
            'text',
            'location',
            'locationExpiresAt',
          ],
        }],
        attributes: [
          'id',
          'name',
          'avatar',
          'pictures',
          'isMock',
          'location',
          'locationExpiresAt',
        ],
      });

      const features = [];

      await nearbyUsers.reduce(async (creatingFeature, user) => {
        await creatingFeature;

        if (user.status && user.status.location && new Date(user.status.locationExpiresAt) > new Date()) {
          const feature = {
            type: 'Feature',
            properties: {},
            geometry: user.status.location,
          };

          feature.properties = {
            type: 'user',
            user: {
              id: user.id,
              name: user.name,
              avatar: await user.ensureAvatar(),
            },
            status: {
              id: user.status.id,
              text: user.status.text,
              updatedAt: user.status.updatedAt,
            },
          };

          features.push(feature);
        }
      }, Promise.resolve());

      // Not using variables because this is a large amount of data
      (await meetup.getUpcomingEvents({
        lon: myArea.center.coordinates[0],
        lat: myArea.center.coordinates[1],
        page: 300,
        radius: Math.floor(kilometersToMiles(process.env.MAP_DISCOVERY_DISTANCE / 1000)),
        fields: 'featured_photo',
        only: [
          'events.id',
          'events.name',
          'events.city',
          'events.duration',
          'events.local_date',
          'events.local_time',
          'events.status',
          'events.yes_rsvp_count',
          'events.duration',
          'events.rsvp_limit',
          // If we filter venue fields, it's not returned correctly.
          // Probably an issue with Meetup's API
          'events.group',
          'events.venue',
          'events.featured_photo',
        ].join(','),
      })).events.forEach((event) => {
        if (!event.venue) return;
        if (!event.venue.lon && !event.venue.lat) return;
        if (/online/i.test(event.venue.address_1)) return;

        const eventFeature = {
          type: 'Feature',
          properties: {
            type: 'event',
            event: {
              id: event.id,
              name: event.name,
              city: event.city,
              maxPeople: event.rsvp_limit,
              attendanceCount: event.yes_rsvp_count,
              featuredPhoto: event.featured_photo?.photo_link,
              localDate: event.local_date,
              localTime: event.local_time,
              duration: event.duration,
              urlname: event.group.urlname,
              link: event.link,
              venueName: event.venue.name,
              address: event.venue.address_1,
              source: 'meetup',
            },
          },
          geometry: {
            type: 'Point',
            coordinates: [event.venue.lon, event.venue.lat],
          },
        };

        features.push(eventFeature);
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
      return user.ensureAvatar();
    },

    discoverable(user) {
      return !!user.discoverable;
    },
  },
};

export default resolvers;
