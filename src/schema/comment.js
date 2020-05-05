import { gql } from 'apollo-server-express';

// TODO: Implement subscriptions
export default gql`
  extend type Query {
    comments(eventId: ID!, limit: Int!, anchor: ID): [Comment]! @auth
    commentsCount(eventId: ID!): Int! @auth
    veryFirstComment(eventId: ID!): Comment @auth
  }

  extend type Mutation {
    createComment(eventId: ID!, text: String!): Comment! @auth
    deleteComment(commentId: ID!): Boolean! @auth
  }

  extend type Subscription {
    commentCreated(eventId: ID!): Comment @auth
    commentDeleted(eventId: ID!): ID @auth
  }

  type Comment {
    id: ID!
    text: String!
    createdAt: DateTime!
    user: User!
  }
`;
