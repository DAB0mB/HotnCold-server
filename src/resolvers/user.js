import moment from 'moment';

import { useCloudinary, useModels, usePubsub } from '../providers';

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
        isTest: myContract.isTest,
      });

      await myContract.setUser(user);
      myContract.signed = true;
      await myContract.save();

      return user.id;
    },

    async updateMyProfile(mutation, { name, birthDate, occupation, bio, pictures }, { me }) {
      const cloudinary = useCloudinary();
      const pubsub = usePubsub();

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

      pubsub.publish('chatUpdated', {
        userUpdated: me,
      });

      return me;
    },
  },

  User: {
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
