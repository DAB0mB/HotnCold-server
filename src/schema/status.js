import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    createStatus(text: String!): Status! @auth
    dropStatus: Vector2D! @auth
    pickupStatus: Boolean @auth
  }

  type Status {
    id: ID!
    text: String!
    updatedAt: DateTime!
    expired: Boolean!
    location: Vector2D
  }
`;
