import { gql } from 'apollo-server-express';

export default gql `
  extend type Query {
    statuses(limit: Int!, anchor: ID): [Status]! @auth
    firstStatus: Status @auth
    areaStatuses(location: Vector2D!): [Status]! @auth
    statusChat(statusId: ID!): Chat @auth
  }

  extend type Mutation {
    createStatus(text: String!, location: Vector2D!): Status! @auth
  }

  type Status {
    id: ID!
    text: String!
    location: Vector2D!
    weight: Int!
    author: User!
    createdAt: DateTime!
  }
`;
