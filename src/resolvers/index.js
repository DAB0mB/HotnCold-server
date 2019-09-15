import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
];
