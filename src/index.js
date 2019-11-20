import 'dotenv/config';
import cloudinary from 'cloudinary';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import DataLoader from 'dataloader';
import express from 'express';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';

import schemaDirectives from './directives';
import loaders from './loaders';
import * as mapbox from './mapbox';
import * as middlewares from './middlewares';
import models from './models';
import resolvers from './resolvers';
import rest from './rest';
import schema from './schema';

const app = express();
const getMe = middlewares.getMe();

{
  const match = process.env.CLOUDINARY_URL.match(/cloudinary:\/\/(\d+):(\w+)@(\.+)/)

  if (match) {
    const [api_key, api_secret, cloud_name] = match.slice(1)
    cloudinary.config({ api_key, api_secret, cloud_name })
  }
}

app.use(cors());
app.use(morgan('dev'));
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
  context: async (context) => {
    const { req, res } = context;

    await Promise.all([
      getMe(req, res),
      // Other async tasks...
    ]);

    return {
      me: req.me,
      models,
      mapbox,
      cloudinary,
      req,
      res,
      loaders: {
        user: new DataLoader(keys =>
          loaders.user.batchUsers(keys, models),
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

httpServer.listen({ port, host }, () => {
  console.log(`Apollo Server on http://${host}:${port}/graphql`);
});
