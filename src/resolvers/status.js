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

      me.status.areaId = me.areaId;
      me.status.location = me.location;
      me.status.locationExpiresAt = new Date(Date.now() + Number(process.env.STATUS_LOCATION_TIMEOUT));
      await me.status.save();

      return me.location.coordinates;
    },

    async pickupStatus(mutation, args, { me }) {
      if (!me.statusId) return;

      me.status.areaId = null;
      me.status.location = null;
      me.status.locationExpiresAt = null;
      await me.status.save();
    },
  },

  Status: {
    location(user) {
      if (!user.location) return null;
      if (new Date(user.locationExpiresAt) < new Date()) return null;

      return user.location.coordinates;
    },
  },
};

export default resolvers;
