import { gql } from 'apollo-server-express';

import areaSchema from './area';
import authSchema from './auth';
import chatSchema from './chat';
import directivesSchema from './directives';
import messageSchema from './message';
import scalarsSchema from './scalars';
import uploadSchema from './upload';
import userSchema from './user';

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
  linkSchema,
  uploadSchema,
  userSchema,
  areaSchema,
  scalarsSchema,
  directivesSchema,
  authSchema,
  chatSchema,
  messageSchema,
];
