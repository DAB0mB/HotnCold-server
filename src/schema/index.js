import { gql } from 'apollo-server-express';

import areaSchema from './area';
import chatSchema from './chat';
import contractSchema from './contract';
import directiveSchema from './directive';
import messageSchema from './message';
import notificationSchema from './notification';
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
  directiveSchema,
  linkSchema,
  messageSchema,
  notificationSchema,
  scalarsSchema,
  uploadSchema,
  userSchema,
  statusSchema,
];
