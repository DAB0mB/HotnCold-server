import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    findOrCreateChat(usersIds: [ID!]!): Chat! @auth
  }

  type Chat {
    id: ID!
    recentMessage: Message
    users: [User]!
  }
`;
