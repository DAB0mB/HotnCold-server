import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    register(firstName: String!, lastName: String!, bio: String!, occupation: String!, birthDate: DateTime!, pictures: [String!]!): String!
  }
`;
