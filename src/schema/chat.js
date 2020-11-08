import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    chat(chatId: ID!): Chat @auth
    chats(limit: Int!, anchor: ID, includeThreads: Boolean): [Chat]! @auth
    firstChat(includeThreads: Boolean): Chat @auth
    participants(chatId: ID!, limit: Int!, anchor: ID): [User]! @auth
    firstParticipant(chatId: ID!): User @auth
  }

  extend type Mutation {
    findOrCreateChat(usersIds: [ID!]!): Chat! @auth
    findOrCreateChat_2(recipientId: ID!): Chat! @auth
    markChatAsRead(chatId: ID!): Boolean @auth
    toggleChatSubscription(chatId: ID!): Boolean! @auth
  }

  extend type Subscription {
    chatBumped: Chat! @auth
  }

  type Chat {
    id: ID!
    title: String
    picture: String
    unreadMessagesCount: Int!
    recentMessages: [Message]!
    firstMessage: Message
    participantsCount: Int!
    recipient: User!
    subscribed: Boolean!
    isThread: Boolean!
  }
`;
