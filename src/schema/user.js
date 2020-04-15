import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    nearbyUsers: [User]! @auth @geo
    userProfile(userId: ID): User @auth @geo
  }

  extend type Mutation {
    createUser(name: String!, bio: String!, occupation: String!, birthDate: DateTime!, pictures: [String!]!): String!
    updateMyProfile(name: String!, bio: String!, occupation: String!, birthDate: DateTime!, pictures: [String!]!): User @auth
    updateMyLocation(location: Vector2D!, featuredAt: DateTime): FeatureCollection @auth
    associateNotificationsToken(token: String!): Boolean! @auth
    dissociateNotificationsToken: Boolean! @auth
    makeDiscoverable: Boolean @auth @geo
    makeIncognito: Boolean @auth
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
    discoverable: Boolean @mine
    occupation: String
    bio: String
    location: Vector2D @mine
    pictures: [String]
    avatar: String
    status: Status
  }
`;
