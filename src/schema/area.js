import { gql } from 'apollo-server-express';

export default gql`
  type Area {
    id: ID!
    name: String!
    shortName: String!
  }
`;
