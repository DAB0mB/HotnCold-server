import { gql } from 'apollo-server-express';

import areaSchema from './area';
import userSchema from './user';

const linkSchema = gql`
  scalar Date
  scalar FeatureCollection
  scalar Vector2D
  scalar Box2D
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

export default [linkSchema, userSchema, areaSchema];
