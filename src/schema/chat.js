import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    chats: [Chat]! @auth
  }

  extend type Mutation {
    findOrCreateChat(usersIds: [ID!]!): Chat! @auth
  }

  extend type Subscription {
    chatBumped: Chat! @auth
  }

  type Chat {
    id: ID!
    title: String!
    picture: String
    recentMessages: [Message]!
    firstMessage: Message
    users: [User]!
  }
`;
