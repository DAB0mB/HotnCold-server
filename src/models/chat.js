import uuid from 'uuid';

import { isUUID } from '../utils';

const chat = (sequelize, DataTypes) => {
  const Chat = sequelize.define('chat', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    isThread: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    isListed: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    bumpedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isTest: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    isMock: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
  });

  Chat.associate = (models) => {
    Chat.hasOne(models.Status);
    Chat.hasMany(models.Message);
    Chat.hasMany(models.ChatSubscription, { as: 'subscriptions' });
    Chat.belongsToMany(models.User, { through: models.ChatUser, as: 'users' });
  };

  Chat.findPrivateChat = async (user, recipient) => {
    const userId = typeof user == 'string' ? user : user.id;
    const recipientId = typeof recipient == 'string' ? recipient : recipient.id;

    // Important to avoid SQL injection
    if (!isUUID(userId)) return null;
    if (!isUUID(recipientId)) return null;

    const { chats_users: ChatUser } = sequelize.models;

    const records = await sequelize.query(
      `SELECT * FROM (SELECT "chats_users"."chatId", COUNT("chats_users"."chatId") AS "usersCount" FROM "${Chat.tableName}" AS "chats" INNER JOIN "${ChatUser.tableName}" AS "chats_users" ON "chats"."id" = "chats_users"."chatId" WHERE "chats_users"."userId" IN ('${userId}', '${recipientId}') AND ("chats"."isThread" = 'f' OR "chats"."isThread" = NULL) GROUP BY "chats_users"."chatId" HAVING COUNT("chats_users"."chatId") = 2) AS "chats_ids" INNER JOIN "${Chat.tableName}" AS "chats" ON "chats_ids"."chatId" = "chats"."id" LIMIT 1`,
      {
        model: Chat,
        mapToModel: true,
      }
    );

    return records[0];
  };

  return Chat;
};

export default chat;
