import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    createStatus(text: String!): Status! @auth
    dropStatus: Vector2D! @auth @geo
    pickupStatus: Boolean @auth
  }

  type Status {
    id: ID!
    text: String!
    location: Vector2D
    updatedAt: DateTime! @auth
  }
`;
