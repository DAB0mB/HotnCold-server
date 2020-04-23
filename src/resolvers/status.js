import { withFilter } from 'apollo-server';
import moment from 'moment';

import { useModels, usePubsub } from '../providers';

const resolvers = {
  Query: {
    async statuses(query, { userId, limit, anchor }, { me }) {
      const { User, Status } = useModels();

      const user = await User.findOne({
        where: { id: userId }
      });

      if (!user) {
        return [];
      }

      const myArea = await me.getArea();

      if (!myArea) {
        return [];
      }

      let anchorPublishedAt = moment().tz(myArea.timezone).startOf('day').toDate();
      if (anchor) {
        const status = await Status.findOne({
          where: { id: anchor },
        });

        if (status) {
          anchorPublishedAt = status.publishedAt;
        }
      }

      const statuses = await Status.findAll({
        where: {
          userId,
          areaId: user.areaId,
          publishedAt: {
            $gt: anchorPublishedAt,
          },
        },
        order: [['publishedAt', 'ASC']],
        limit,
      });

      return statuses;
    },

    async veryFirstStatus(query, { userId }, { me }) {
      const { Status, User } = useModels();

      const user = await User.findOne({
        where: { id: userId },
      });

      if (!user) return null;

      const myArea = await me.getArea();

      if (!myArea) return null;

      const statuses = await Status.findAll({
        where: {
          userId,
          areaId: myArea.id,
          publishedAt: {
            $gt: moment().tz(myArea.timezone).startOf('day').toDate(),
          },
        },
        order: [['publishedAt', 'DESC']],
        limit: 1,
      });

      return statuses[0];
    },
  },

  Mutation: {
    async createStatus(mutation, { text, location, publishedAt }, { me, myContract }) {
      const { Status } = useModels();
      const pubsub = usePubsub();

      const status = new Status({
        text,
        publishedAt,
        userId: me.id,
        areaId: me.areaId,
        isTest: myContract.isTest,
        location: {
          type: 'Point',
          coordinates: location,
        },
      });
      await status.save();

      pubsub.publish('statusCreated', {
        areaId: me.areaId,
        statusCreated: status,
      });

      return status;
    },

    async deleteStatus(mutation, { statusId }, { me }) {
      const { Status } = useModels();
      const pubsub = usePubsub();

      const status = await Status.findOne({
        where: { id: statusId },
      });

      if (!status) return false;

      await status.destroy();

      pubsub.publish('statusDeleted', {
        areaId: me.areaId,
        statusDeleted: status,
      });

      return true;
    },
  },

  Subscription: {
    statusCreated: {
      resolve({ statusCreated }) {
        const { Status } = useModels();

        return new Status(statusCreated);
      },
      subscribe: withFilter(
        () => usePubsub().asyncIterator('statusCreated'),
        async ({ areaId, statusCreated }, { userId }, { me }) => {
          return (
            me &&
            statusCreated &&
            statusCreated.areaId === areaId &&
            statusCreated.userId === userId
          );
        },
      ),
    },

    statusDeleted: {
      resolve({ statusDeleted }) {
        return statusDeleted.id;
      },
      subscribe: withFilter(
        () => usePubsub().asyncIterator('statusDeleted'),
        async ({ areaId, statusDeleted }, { userId }, { me }) => {
          return (
            me &&
            statusDeleted &&
            statusDeleted.areaId === areaId &&
            statusDeleted.userId === userId
          );
        },
      ),
    },
  },

  Status: {
    location(status) {
      return status.location?.coordinates;
    },

    user(status) {
      return status.getUser();
    },
  },
};

export default resolvers;
