import { gql } from 'apollo-server-express';

export default gql`
  type Area {
    id: ID!
    name: String!
    datasetId: ID! # The dataset in Mapbox API
    geoFeatureId: ID! # The ID of the feature that represents the bounds that we get from running geocoding
  }
`;
