import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    users(usersIds: [ID!]!): [User]! @auth
    userProfile(userId: ID, randomMock: Boolean, recentlyScanned: Boolean): User @auth
  }

  extend type Mutation {
    createUser(notificationsToken: String!, name: String!, bio: String!, occupation: String!, birthDate: DateTime!, pictures: [String!]!): String!
    updateMyProfile(name: String!, bio: String!, occupation: String!, birthDate: DateTime!, pictures: [String!]!): User @auth
    updateMyLocation(location: Vector2D!): FeatureCollection @auth
    updateRecentScanTime(clear: Boolean): DateTime @auth
    associateNotificationsToken(token: String!): Boolean! @auth
    dissociateNotificationsToken: Boolean! @auth
  }

  extend type Subscription {
    userCreated: User! @auth
  }

  type User {
    id: ID!
    name: String!
    # gender: String!
    birthDate: DateTime @mine
    age: String!
    occupation: String
    bio: String
    location: Vector2D @mine
    pictures: [String]
    avatar: String
  }
`;
