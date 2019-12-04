import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import DataLoader from 'dataloader';
import express from 'express';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';

import bootstrap from './bootstrap';
import schemaDirectives from './directives';
import loaders from './loaders';
import * as middlewares from './middlewares';
import { useServices } from './providers';
import resolvers from './resolvers';
import rest from './rest';
import schema from './schema';
import { get } from './utils';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(middlewares.getMe());
app.use(rest);

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  schemaDirectives,
  formatError: error => {
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
  context: async ({ req, res, connection }) => {
    const { auth } = useServices();

    const me = (
      get(req, 'me') ||
      await auth.getMe(get(connection, 'context.cookie.authToken'))
    );

    return {
      me,
      req,
      res,
      connection,
      loaders: {
        user: new DataLoader(keys =>
          loaders.user.batchUsers(keys),
        ),
      },
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
  console.error('Failed to bootstrap.');

  process.exit(1);
});
