import * as GraphQLGeo from 'graphql-geojson-scalar-types';
import { GraphQLDateTime } from 'graphql-iso-date';
import merge from 'merge-deep';

import areaResolvers from './area';
import chatResolvers from './chat';
import commentResolvers from './comment';
import contractResolvers from './contract';
import eventResolvers from './event';
import messageResolvers from './message';
import uploadResolvers from './upload';
import userResolvers from './user';
import statusResolvers from './status';
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
  commentResolvers,
  contractResolvers,
  customScalarResolver,
  eventResolvers,
  messageResolvers,
  uploadResolvers,
  userResolvers,
  statusResolvers,
);
