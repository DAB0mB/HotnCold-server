import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    usersLocationsInArea(center: Vector2D!, bounds: Box2D!): FeatureCollection
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
    location: Vector2D
    pictures: [String]
  }
`;
