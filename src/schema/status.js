import { gql } from 'apollo-server-express';

export default gql `
  extend type Query {
    status(statusId: ID!): Status @auth
    statuses(limit: Int!, anchor: ID): [Status]! @auth
    statusChat(statusId: ID!): Chat @auth
    firstStatus: Status @auth
    areaStatuses(location: Vector2D!): [Status]! @auth
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
    chat: Chat!
    createdAt: DateTime!
  }
`;
