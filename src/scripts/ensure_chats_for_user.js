#!/usr/bin/env ./node_modules/.bin/babel-node
import minimist from 'minimist';
import uuid from 'uuid';

import bootstrap from '../bootstrap';
import { useDb } from '../providers';

const {
  user: userId,
  undo,
} = minimist(process.argv.slice(2), {
  string: ['user'],
  boolean: ['undo'],
});

if (!userId) {
  throw Error('"userId" was not provided');
}

bootstrap().then(async () => {
  const db = useDb();

  // Validate existence
  await db.one(`
    SELECT *
    FROM users
    WHERE id = $(userId) AND "isTest" IS NOT TRUE AND "isMock" IS NOT TRUE
  `, { userId });

  if (undo) {
    let chatsIds = await db.any(`
      SELECT chats.id
      FROM chats
      INNER JOIN chats_users
      ON chats_users."chatId" = chats.id
      WHERE chats_users."userId" = $(userId) AND chats."isThread" IS NOT TRUE AND NOT EXISTS (
        SELECT 1
        FROM messages
        WHERE messages."chatId" = chats.id
        LIMIT 1
      )
    `, { userId });
    chatsIds = chatsIds.map(c => c.id);

    await db.tx((t) => {
      const queries = [];

      chatsIds.forEach((chatId) => {
        queries.push(db.any(`
          DELETE
          FROM chats
          WHERE id = $(chatId)
        `, { chatId }));

        queries.push(db.any(`
          DELETE
          FROM chats_users
          WHERE "chatId" = $(chatId)
        `, { chatId }));
      });

      return t.batch(queries);
    });

    console.log(`successfully removed chats for user ${userId}`);
  }
  else {
    let recipientsIds = await db.any(`
      SELECT id
      FROM users
      WHERE "isTest" IS NOT TRUE AND id not IN (
        SELECT DISTINCT chats_users."userId"
        FROM chats_users
        INNER JOIN (
          SELECT DISTINCT "chatId"
          FROM chats_users
          WHERE "userId" = $(userId)
        ) chats_ids
        ON chats_ids."chatId" = chats_users."chatId"
      )
    `, { userId });
    recipientsIds = recipientsIds.map(u => u.id);

    await db.tx((t) => {
      const date = new Date();
      const queries = [];

      recipientsIds.forEach((recipientId) => {
        const chatId = uuid();

        queries.push(db.any(`
          INSERT INTO chats(id, "isThread", "isListed", "bumpedAt", "isTest", "isMock", "createdAt", "updatedAt")
          VALUES($(chatId), 'f', 't', $(date), 'f', 'f', $(date), $(date))
        `, {
          chatId,
          date,
        }));

        queries.push(db.any(`
          INSERT INTO chats_users("userId", "chatId", "unreadMessagesIds", "isMock", "isTest", "createdAt", "updatedAt")
          VALUES
            ($(userId), $(chatId), '{}', 'f', 'f', $(date), $(date)),
            ($(recipientId), $(chatId), '{}', 'f', 'f', $(date), $(date))
        `, {
          recipientId,
          userId,
          chatId,
          date,
        }));
      });

      return t.batch(queries);
    });

    console.log(`successfully ensured chats for user ${userId}`);
  }

  process.exit(0);
}, (e) => {
  console.error('Failed to bootstrap :(');
  console.error(e);
  process.exit(1);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
