import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    areas(searchText: String!): [Area]! @auth
    localAreaPlaces(location: Vector2D!, searchText: String!): FeatureCollection! @auth
  }

  type Area {
    id: ID!
    name: String!
    shortName: String!
    timezone: String!
    center: Vector2D!
  }
`;
