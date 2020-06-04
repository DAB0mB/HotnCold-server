import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    areas(searchText: String!): [Area]! @auth
  }

  type Area {
    id: ID!
    name: String!
    shortName: String!
    timezone: String!
    center: Vector2D!
  }
`;
