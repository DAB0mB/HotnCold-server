import * as GraphQLGeo from 'graphql-geojson-scalar-types';
import { GraphQLDateTime } from 'graphql-iso-date';
import merge from 'merge-deep';

import areaResolvers from './area';
import chatResolvers from './chat';
import contractResolvers from './contract';
import messageResolvers from './message';
import notificationResolvers from './notification';
import uploadResolvers from './upload';
import statusResolvers from './status';
import userResolvers from './user';
import { Vector2D, Box2D } from '../scalars';

const customScalarResolver = {
  DateTime: GraphQLDateTime,
  FeatureCollection: GraphQLGeo.FeatureCollection,
  Vector2D,
  Box2D,
};

export default merge(
  areaResolvers,
  chatResolvers,
  contractResolvers,
  customScalarResolver,
  messageResolvers,
  notificationResolvers,
  uploadResolvers,
  userResolvers,
  statusResolvers,
);
