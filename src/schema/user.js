import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    userProfile(userId: ID!): User
  }

  extend type Mutation {
    updateMyProfile(firstName: String!, lastName: String!, bio: String!, occupation: String!, birthDate: DateTime!, pictures: [String!]!): User @auth
    updateMyLocation(location: Vector2D!): FeatureCollection @auth
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String @mine
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
