import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    usersLocationsInMyArea: FeatureCollection
  }

  extend type Mutation {
    updateUserLocation(userId: String, location: Vector2D): User
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
