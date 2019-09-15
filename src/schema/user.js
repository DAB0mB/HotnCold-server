import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    gender: String!
    birthDate: String!
    occupation: String
    bio: String
    pictures: [String]
  }
`;
