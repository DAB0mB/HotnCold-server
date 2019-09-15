import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    age: Int!
    job: String
    bio: String
    pictures: [String]
  }
`;
