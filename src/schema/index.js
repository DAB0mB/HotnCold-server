import { gql } from 'apollo-server-express';

import userSchema from './user';

const linkSchema = gql`
  scalar Date
  scalar Point
  scalar BBox

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, userSchema];
