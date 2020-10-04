import Sequelize, { Op } from 'sequelize';

import { useModels } from '../providers';

const resolvers = {
  Query: {
    // Older version support
    async statusChat(query, { statusId }) {
      const status = await resolvers.Query.status(query, { statusId });

      return status?.chat || null;
    },

    async status(query, { statusId }) {
      const { Status, Chat, User } = useModels();

      const status = await Status.findOne({
        include: [
          {
            model: User,
            as: 'users',
            through: {
              where: { isAuthor: true },
            },
          },
          {
            model: Chat,
            as: 'chat',
          },
        ],
        where: { id: statusId },
      });

      if (!status) {
        return null;
      }

      status.chat.recipient = status.users[0];

      return status;
    },

    async statuses(query, { userId, limit, anchor }, { me }) {
      const { User } = useModels();

      const user = !userId ? me : await User.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw Error(`User with ID ${userId} not found`);
      }

      let anchorCreatedAt = new Date();
      if (anchor) {
        const [status] = await user.getStatuses({
          where: { id: anchor },
          attributes: ['createdAt'],
          limit: 1,
        });

        if (status) {
          anchorCreatedAt = status.createdAt;
        }
      }

      const statuses = await user.getStatuses({
        ...(userId ?({
          through: {
            where: { isAuthor: true },
          }
        }): {}),
        where: {
          createdAt: { [Op.lt]: anchorCreatedAt },
          ...(userId !== me.id ? { published: true } : {}),
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
            published: true,
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
    async createStatus(mutation, { text, images, location, published }, { me, myContract }) {
      const { Area, Chat, Status, ChatSubscription } = useModels();

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

      // Subscribe by default to created chats
      await ChatSubscription.create({
        chatId: chat.id,
        userId: me.id,
        isActive: true,
        isTest: myContract.isTest,
      });

      const status = new Status({
        text,
        images,
        published: !!published,
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

    async publishStatus(mutation, { statusId }) {
      const { Status } = useModels();

      const [updateCount] = await Status.update({
        published: true,
      }, {
        where: { id: statusId },
      });

      return !!updateCount;
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

    images(status) {
      return status.images || [];
    },

    firstImage(status) {
      return status.images?.[0] || null;
    },

    thumb(status) {
      return status.ensureThumb();
    },

    avatar(status) {
      return status.ensureAvatar();
    },

    published(status) {
      return !!status.published;
    },

    async chat(status) {
      return status.chat || status.getChat();
    },
  },
};

export default resolvers;
