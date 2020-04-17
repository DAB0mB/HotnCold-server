import { gql } from 'apollo-server-express';

// TODO: Implement subscriptions
export default gql`
  extend type Query {
    statuses(userId: ID!, limit: Int!, anchor: ID): [Status]! @auth
    veryFirstStatus(userId: ID!): Status @auth
  }

  extend type Mutation {
    createStatus(text: String!, location: Vector2D!, publishedAt: DateTime!): Status! @auth
    deleteStatus(statusId: ID!): Boolean! @auth
  }

  extend type Subscription {
    statusCreated(userId: ID!): Status @auth
    statusDeleted(userId: ID!): ID @auth
  }

  type Status {
    id: ID!
    text: String!
    location: Vector2D!
    publishedAt: DateTime!
    user: User!
  }
`;
