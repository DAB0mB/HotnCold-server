import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    # usersLocationsInMyVenue: [Point!]!
    usersLocationsInArea(bounds: BBox!): [Point!]!
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
    location: Point
    pictures: [String]
  }
`;
