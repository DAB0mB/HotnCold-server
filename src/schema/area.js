import { gql } from 'apollo-server-express';

export default gql`
  type Area {
    id: ID!
    datasetId: ID!
    name: String!
    bbox: Box2D
  }
`;
