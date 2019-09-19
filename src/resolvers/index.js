import { GraphQLDateTime } from 'graphql-iso-date';
import * as GraphQLGeo from 'graphql-geojson-scalar-types';

import userResolvers from './user';

const customScalarResolver = {
  Date: GraphQLDateTime,
  Point: GraphQLGeo.Point,
  BBox: GraphQLGeo.Bbox,
};

export default [
  customScalarResolver,
  userResolvers,
];
