import { gql } from 'apollo-server-express';

export default gql`
  scalar DateTime
  scalar FeatureCollection
  scalar Vector2D
  scalar Box2D
  scalar BBox
`;
