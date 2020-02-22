import { useModels } from '../providers';

const resolvers = {
  Mutation: {
    async createStatus(mutation, { text }, { me }) {
      const { Status } = useModels();

      const status = await Status.create({ text });

      await me.setStatus(status);

      return status;
    },

    async dropStatus(mutation, args, { me }) {
      if (!me.statusId) {
        throw Error('Cannot drop a status if it wasn\'t yet created');
      }

      await me.setStatus({
        location: me.location,
        expiresAt: new Date(Date.now() + process.env.STATUS_TIMEOUT),
      }, {
        fields: ['location'],
      });

      return me.location;
    },

    async pickupStatus({ me }) {
      if (!me.statusId) return;

      await me.setStatus({
        location: null,
        expiresAt: null,
      }, {
        fields: ['location'],
      });
    },
  },

  Status: {
    expired(status) {
      return !status.expiresAt || status.expiresAt < new Date();
    },
  },
};

export default resolvers;
