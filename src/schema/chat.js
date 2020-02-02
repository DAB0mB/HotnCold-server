import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    chat(chatId: ID!): Chat @auth
    chats: [Chat]! @auth
  }

  extend type Mutation {
    findOrCreateChat(usersIds: [ID!]!): Chat! @auth
    markChatAsRead(chatId: ID!): Boolean @auth
  }

  extend type Subscription {
    chatBumped: Chat! @auth
  }

  type Chat {
    id: ID!
    title: String!
    picture: String
    unreadMessagesCount: Int!
    recentMessages: [Message]!
    firstMessage: Message
    users: [User]!
  }
`;
