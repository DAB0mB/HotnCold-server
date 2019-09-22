import { GraphQLDateTime } from 'graphql-iso-date';
import * as GraphQLGeo from 'graphql-geojson-scalar-types';

import areaResolvers from './area';
import userResolvers from './user';
import { Vector2D, Box2D } from '../scalars';

const customScalarResolver = {
  Date: GraphQLDateTime,
  FeatureCollection: GraphQLGeo.FeatureCollection,
  Vector2D,
  Box2D,
};

export default [
  customScalarResolver,
  userResolvers,
];
