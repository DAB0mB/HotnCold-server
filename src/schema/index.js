import { gql } from 'apollo-server-express';

import areaSchema from './area';
import chatSchema from './chat';
import contractSchema from './contract';
import directivesSchema from './directives';
import messageSchema from './message';
import scalarsSchema from './scalars';
import uploadSchema from './upload';
import userSchema from './user';
import statusSchema from './status';

const linkSchema = gql`
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

export default [
  areaSchema,
  chatSchema,
  contractSchema,
  directivesSchema,
  linkSchema,
  messageSchema,
  scalarsSchema,
  uploadSchema,
  userSchema,
  statusSchema,
];
