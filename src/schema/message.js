import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    messages(chatId: ID!, anchor: ID): [Message]! @auth
  }

  extend type Mutation {
    sendMessage(chatId: ID!, text: String!): Message! @auth
  }

  extend type Subscription {
    messageSent(chatId: ID!): Message! @auth
  }

  type Message {
    id: ID!
    createdAt: DateTime!
    text: String!
    user: User!
  }
`;
