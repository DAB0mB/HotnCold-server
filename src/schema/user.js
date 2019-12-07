import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    userProfile(userId: ID, randomMock: Boolean): User @auth
  }

  extend type Mutation {
    updateMyProfile(name: String!, bio: String!, occupation: String!, birthDate: DateTime!, pictures: [String!]!): User @auth
    updateMyLocation(location: Vector2D!): FeatureCollection @auth
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
