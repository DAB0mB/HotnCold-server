import 'dotenv/config';

import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import asyncHandler from 'express-async-handler';

import bootstrap from './bootstrap';
import schemaDirectives from './directives';
import * as middlewares from './middlewares';
import { initLoaders } from './loaders';
import { useDb, useModels } from './providers';
import resolvers from './resolvers';
import rest from './rest';
import schema from './schema';
import { get } from './utils';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(middlewares.me());
app.use(rest);

app.use(asyncHandler(async (req, res, next) => {
  const db = useDb();

  req.on('close', () => {
    req.db?.done();
  });

  req.db = await db.connect();

  next();
}));

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  schemaDirectives,
  formatError: error => {
    console.error(error);

    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  subscriptions: {
    async onConnect(connectionParams) {
      const db = useDb();

      return {
        ...connectionParams,
        db: await db.connect(),
      };
    },
    async onDisconnect(ws, context) {
      // Sometimes initPromise will return true (???) there doesn't seem to be any leak
      const { db } = await context.initPromise;

      db?.done();
    },
  },
  context: async ({ req, res, connection }) => {
    const { Contract } = useModels();

    let me;
    let db;
    let myContract;
    getMe:
    if (connection) {
      db = connection.context.db;
      const authToken = get(connection, 'context.cookie.authToken');

      if (!authToken) break getMe;

      myContract = await Contract.findByToken(authToken);

      if (!myContract) break getMe;

      me = await myContract.getUser();
    }
    else {
      me = req.me;
      db = req.db;
      myContract = req.myContract;
    }

    return {
      req,
      res,
      me,
      db,
      connection,
      myContract,
      loaders: initLoaders(),
    };
  },
});

server.applyMiddleware({
  app,
  path: '/graphql',
  cors: { credentials: true },
});

const port = process.env.PORT || 8000;
const host = process.env.HOST || '0.0.0.0';
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

bootstrap().then(() => {
  httpServer.listen({ port, host }, () => {
    console.log(`Apollo Server on http://${host}:${port}/graphql`);
  });
}).catch((e) => {
  console.error('Failed to bootstrap :(');
  console.error(e);

  process.exit(1);
});
