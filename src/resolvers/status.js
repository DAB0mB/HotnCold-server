import Sequelize, { Op } from 'sequelize';

import { useModels } from '../providers';

const resolvers = {
  Query: {
    async statusChat(query, { statusId }) {
      const { Status, User } = useModels();

      const status = await Status.findOne({
        include: [
          {
            model: User,
            as: 'users',
            through: {
              where: { isAuthor: true },
            },
          },
        ],
        where: { id: statusId },
      });

      if (!status) {
        return null;
      }

      const chat = await status.getChat();

      chat.recipient = status.users[0];

      return chat;
    },

    async statuses(query, { limit, anchor }, { me }) {
      let anchorCreatedAt = new Date(0);
      if (anchor) {
        const [status] = await me.getStatuses({
          where: { id: anchor },
          attributes: ['createdAt'],
          limit: 1,
        });

        if (status) {
          anchorCreatedAt = status.createdAt;
        }
      }

      const statuses = await me.getStatuses({
        where: {
          createdAt: { [Op.gt]: anchorCreatedAt }
        },
        order: [['createdAt', 'DESC']],
        limit,
      });

      return statuses;
    },

    async firstStatus(query, args, { me }) {
      const [status] = await me.getStatuses({
        order: [['createdAt', 'ASC']],
        limit: 1,
      });

      return status || null;
    },

    async areaStatuses(query, { location }, { me, myContract }) {
      const { Area, Status } = useModels();

      const area = await Area.findOne({
        where: Sequelize.where(Sequelize.fn('ST_Contains', Sequelize.col('area.polygon'), Sequelize.fn('ST_MakePoint', ...location)), true),
      });

      if (!area) {
        return [];
      }

      if (myContract.isTest) {
        const myStatuses = await me.getStatuses({
          where: {
            expiresAt: { [Op.gt]: new Date() },
          },
        });

        const statuses = await Status.findAll({
          where: {
            expiresAt: { [Op.gt]: new Date() },
            areaId: area.id,
            isMock: true,
          },
        });

        return [...myStatuses, ...statuses];
      }

      return Status.findAll({
        where: {
          expiresAt: { [Op.gt]: new Date() },
          areaId: area.id,
          isTest: { [Op.or]: [false, null] },
          isMock: { [Op.or]: [false, null] },
        },
      });
    },
  },

  Mutation: {
    async createStatus(mutation, { text, location }, { me, myContract }) {
      const { Area, Chat, Status } = useModels();

      const area = await Area.findOne({
        where: Sequelize.where(Sequelize.fn('ST_Contains', Sequelize.col('area.polygon'), Sequelize.fn('ST_MakePoint', ...location)), true),
      });

      if (!area) {
        throw Error('Status location not supported');
      }

      const chat = new Chat({
        isListed: true,
        isThread: true,
        isTest: myContract.isTest,
        bumpedAt: new Date(),
      });
      await chat.save();
      await chat.addUser(me, {
        through: {
          isTest: myContract.isTest,
        },
      });

      const status = new Status({
        text,
        areaId: area.id,
        chatId: chat.id,
        isTest: myContract.isTest,
        expiresAt: new Date(Date.now() + Number(process.env.STATUS_TTL)),
        location: {
          type: 'Point',
          coordinates: location,
        },
      });
      await status.save();
      await status.addUser(me, {
        through: {
          isAuthor: true,
          isTest: myContract.isTest,
        },
      });

      return status;
    },
  },

  Status: {
    location(status) {
      return status.location?.coordinates;
    },

    async author(status) {
      const [user] = await status.getUsers({
        through: {
          where: {
            isAuthor: true,
          },
        },
      });

      return user || null;
    },

    weight(status) {
      return status.countUsers();
    },
  },
};

export default resolvers;
