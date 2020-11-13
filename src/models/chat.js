import uuid from 'uuid';

import { useDb, useModels } from '../providers';
import { isUUID, fork } from '../utils';

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

  Chat.resolveFull = async (chatId, { db = useDb() } = {}) => {
    const { Message, Status, User } = useModels();

    const _chat = await db.oneOrNone(`
      SELECT row_to_json(chat) AS chat, row_to_json(recent_messages) as "recentMessages", row_to_json(first_message) as "firstMessage", row_to_json(status) as status, row_to_json(author) as author, participants_count.count as "participantsCount"
      FROM (
        SELECT *
        FROM chats
        WHERE id = $(chatId)
      ) chat
      LEFT JOIN (
        SELECT COUNT(*)
        FROM chats_users
        WHERE "chatId" = $(chatId)
      ) AS participants_count
      ON TRUE
      LEFT JOIN (
        SELECT json_agg(messages)
        FROM (
          SELECT *
          FROM messages
          INNER JOIN users
          ON users.id = messages."userId"
          WHERE messages."chatId" = $(chatId)
          ORDER BY messages."createdAt"
          DESC
          LIMIT 12
        ) AS messages
      ) AS recent_messages
      ON TRUE
      LEFT JOIN (
        SELECT row_to_json(messages)
        FROM (
          SELECT *
          FROM messages
          INNER JOIN users
          ON users.id = messages."userId"
          WHERE messages."chatId" = $(chatId)
          ORDER BY messages."createdAt"
          ASC
          LIMIT 1
        ) AS messages
      ) AS first_message
      ON TRUE
      LEFT JOIN statuses AS status
      ON status."chatId" = $(chatId)
      LEFT JOIN LATERAL (
        SELECT users.*
        FROM users
        INNER JOIN statuses_users
        ON statuses_users."statusId" = status.id AND statuses_users."isAuthor" IS TRUE
        WHERE users.id = statuses_users."userId"
        LIMIT 1
      ) AS author
      ON TRUE
    `, {
      chatId,
    });

    if (!_chat) return null;

    const chat = new Chat({}, { isNewRecord: false }).set(_chat.chat, { raw: true });
    chat.recentMessages = !_chat.recentMessages?.json_agg ? [] : _chat.recentMessages.json_agg.map(m => new Message({}, { isNewRecord: false }).set(m, { raw: true }));
    chat.firstMessage = !_chat.firstMessage ? null : new Message({}, { isNewRecord: false }).set(_chat.firstMessage.row_to_json, { raw: true });
    chat.status = !_chat.status ? null : new Status({}, { isNewRecord: false }).set(_chat.status, { raw: true });
    chat.author = !_chat.author ? null : new User({}, { isNewRecord: false }).set(_chat.author, { raw: true });
    chat.subscribed = !!_chat.subscribed;
    chat.participantsCount = _chat.participantsCount;

    chat.relativeTo = async (myId, { db = useDb() } = {}) => {
      const _chat = await db.oneOrNone(`
        SELECT unread_messages_count."unreadMessagesIds", subscribed.count as subscribed, row_to_json(recipient) as recipient
        FROM (
          SELECT *
          FROM chats
          WHERE id = $(chatId)
        ) chat
        LEFT JOIN (
          SELECT *
          FROM chats_users
          WHERE "chatId" = $(chatId) AND "userId" != $(myId)
          LIMIT 1
        ) AS not_me
        ON TRUE
        LEFT JOIN (
          SELECT "unreadMessagesIds"
          FROM chats_users
          WHERE "chatId" = $(chatId) AND "userId" = $(myId)
        ) AS unread_messages_count
        ON TRUE
        LEFT JOIN (
          SELECT COUNT(*)
          FROM chats_subscriptions
          WHERE "chatId" = $(chatId) AND "userId" = $(myId) AND "isActive" IS TRUE
          LIMIT 1
        ) AS subscribed
        ON TRUE
        ${chat.author ? `
          LEFT JOIN (
            SELECT *
            FROM users
            WHERE id = $(authorId)
          ) AS recipient
          ON TRUE
        ` : `
          LEFT JOIN LATERAL (
            SELECT *
            FROM users
            WHERE id = not_me."userId"
          ) AS recipient
          ON TRUE
        `}
      `, {
        myId,
        chatId,
        authorId: chat.author?.id,
      });

      const myChat = fork(chat);
      myChat.unreadMessagesCount = _chat.unreadMessagesIds?.length ?? 0;
      myChat.subscribed = !!Number(_chat.subscribed);
      myChat.recipient = !_chat.recipient ? null : new User({}, { isNewRecord: false }).set(_chat.recipient, { raw: true });

      return myChat;
    };

    return chat;
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
