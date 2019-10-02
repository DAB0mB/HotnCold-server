import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    user(userId: ID!): User
  }

  extend type Mutation {
    updateMyLocation(location: Vector2D!): FeatureCollection
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String @mine
    gender: String!
    birthDate: Date @mine
    age: String!
    occupation: String
    bio: String
    location: Vector2D @mine
    pictures: [String]
    area: Area
  }
`;
