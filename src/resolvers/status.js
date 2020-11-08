import Sequelize, { Op } from 'sequelize';

import { useModels } from '../providers';

const resolvers = {
  Query: {
    // Older version support
    async statusChat(query, { statusId }) {
      const status = await resolvers.Query.status(query, { statusId });

      return status?.chat || null;
    },

    async status(query, { statusId, chatId }, { db }) {
      const { Status, Chat, User } = useModels();

      if (chatId) {
        const [status] = await db.map(`
          SELECT statuses.*, ST_AsGeoJSON(statuses.location)::json as location, row_to_json(users) as author
          FROM (
            SELECT statuses.*, statuses_users."userId"
            FROM (
              SELECT statuses.*, row_to_json(chats) as chat
              FROM statuses
              INNER JOIN chats
              ON chats.id = $(chatId)
              WHERE chats.id = statuses."chatId"
            ) AS statuses
            INNER JOIN statuses_users
            ON statuses_users."statusId" = statuses.id
            WHERE statuses_users."isAuthor" IS TRUE
          ) AS statuses
          INNER JOIN users
          ON users.id = statuses."userId"
        `, {
          chatId,
        }, (s) => {
          const status = new Status(s);
          status.chat = new Chat(s.chat);
          status.chat.recipient = new User(s.author);

          return status;
        });

        return status;
      }
      else {
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
      }
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

    async areaStatuses(query, { location }, { db, me, myContract }) {
      const { Status, Area } = useModels();

      const area = await Area.findOne({
        where: Sequelize.where(Sequelize.fn('ST_Contains', Sequelize.col('area.polygon'), Sequelize.fn('ST_MakePoint', ...location)), true),
      });

      if (!area) {
        return [];
      }

      const exprMargin = Number(process.env.STATUS_EXPR_MARGIN || '0');
      const exprDate = new Date(Date.now() - exprMargin);

      const subQuery = myContract.isTest ? `
        statuses_users."userId" = $(myId) OR
        (statuses."isMock" = 't' AND statuses.published = 't')
      ` : `
        (statuses."isTest" = 'f' OR statuses."isTest" IS NULL) AND
        (statuses."isMock" = 'f' OR statuses."isMock" IS NULL) AND (
          statuses_users."userId" = $(myId) OR
          statuses.published = 't'
        )
      `;

      return db.map(`
        SELECT statuses.*, row_to_json(users) as author
        FROM (
          SELECT statuses.*, statuses_users."userId" as "authorId"
          FROM (
            SELECT statuses.*, ST_AsGeoJSON(statuses.location)::json as location, statuses_weights.weight
            FROM statuses
            INNER JOIN (
              SELECT statuses_users."statusId", COUNT(DISTINCT statuses_users."userId") as weight
              FROM statuses
              INNER JOIN statuses_users
              ON statuses_users."statusId" = statuses.id
              WHERE (
                "expiresAt" >= $(exprDate) AND
                "areaId" = $(areaId) AND (${subQuery})
              )
              GROUP BY statuses_users."statusId"
            ) AS statuses_weights
            ON statuses_weights."statusId" = statuses.id
          ) as statuses
          INNER JOIN statuses_users
          ON statuses_users."statusId" = statuses.id
          WHERE statuses_users."isAuthor" = 't'
        ) as statuses
        INNER JOIN users
        ON users.id = statuses."authorId";
      `, {
        exprDate,
        areaId: area.id,
        myId: me.id,
      }, s => {
        const status = new Status(s);
        status.author = s.author;
        status.weight = s.weight;

        return status;
      });
    },
  },

  Mutation: {
    async createStatus(mutation, { text, images, location, published, isMeetup }, { me, myContract }) {
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
        isMeetup: !!isMeetup,
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
      const { User } = useModels();

      if (status.author) {
        return new User(status.author);
      }

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
      return status.weight ? Number(status.weight) : status.countUsers();
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

    isMeetup(status) {
      return !!status.isMeetup;
    },

    async chat(status) {
      return status.chat || status.getChat();
    },
  },
};

export default resolvers;
