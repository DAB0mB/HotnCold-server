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

import schemaDirectives from './directives';
import loaders from './loaders';
import * as mapbox from './mapbox';
import models from './models';
import resolvers from './resolvers';
import schema from './schema';

const app = express();

app.use(cors());
app.use(morgan('dev'));

const getMe = (req) => {
  // TODO: Get from req

  return models.User.findOne({
    where: {
      firstName: 'Eytan',
      lastName: 'Manor',
    }
  });
};

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
  context: async ({ req, connection }) => {
    if (!connection && !req) return;

    const me = await getMe(req);

    return {
      me,
      models,
      mapbox,
      loaders: {
        user: new DataLoader(keys =>
          loaders.user.batchUsers(keys, models),
        ),
      },
    };
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.PORT || 8000;
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port }, () => {
  console.log(`Apollo Server on http://localhost:${port}/graphql`);
});
