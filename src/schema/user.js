import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
  }

  extend type Mutation {
    updateMyLocation(location: Vector2D!): FeatureCollection
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    gender: String!
    birthDate: String!
    age: String!
    occupation: String
    bio: String
    dataset: String
    location: Vector2D
    pictures: [String]
  }
`;
