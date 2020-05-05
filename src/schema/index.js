import { gql } from 'apollo-server-express';

import areaSchema from './area';
import chatSchema from './chat';
import commentSchema from './comment';
import contractSchema from './contract';
import directiveSchema from './directive';
import eventSchema from './event';
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
  commentSchema,
  contractSchema,
  directiveSchema,
  eventSchema,
  linkSchema,
  messageSchema,
  scalarsSchema,
  uploadSchema,
  userSchema,
  statusSchema,
];
