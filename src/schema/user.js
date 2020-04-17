import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    userProfile(userId: ID): User @auth @geo
  }

  extend type Mutation {
    createUser(name: String!, bio: String!, occupation: String!, birthDate: DateTime!, pictures: [String!]!): String!
    updateMyProfile(name: String!, bio: String!, occupation: String!, birthDate: DateTime!, pictures: [String!]!): User @auth
    updateMyLocation(location: Vector2D!, featuredAt: DateTime!): FeatureCollection @auth
    associateNotificationsToken(token: String!): Boolean! @auth
    dissociateNotificationsToken: Boolean! @auth
  }

  extend type Subscription {
    userCreated: User! @auth
  }

  type User {
    id: ID!
    name: String!
    birthDate: DateTime @mine
    age: String!
    occupation: String
    bio: String
    location: Vector2D @mine
    pictures: [String]
    avatar: String
    area: Area
  }
`;
