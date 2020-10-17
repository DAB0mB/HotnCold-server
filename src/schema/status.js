import { gql } from 'apollo-server-express';

export default gql `
  extend type Query {
    status(statusId: ID!): Status @auth
    statuses(userId: ID, limit: Int!, anchor: ID): [Status]! @auth
    statusChat(statusId: ID!): Chat @auth
    firstStatus: Status @auth
    areaStatuses(location: Vector2D!): [Status]! @auth
  }

  extend type Mutation {
    createStatus(text: String!, images: [String]!, location: Vector2D!, published: Boolean, isMeetup: Boolean): Status! @auth
    publishStatus(statusId: ID!): Boolean! @auth
  }

  type Status {
    id: ID!
    text: String!
    location: Vector2D!
    weight: Int!
    author: User!
    chat: Chat!
    images: [String]
    firstImage: String
    thumb: String
    avatar: String
    published: Boolean!
    isMeetup: Boolean!
    createdAt: DateTime!
  }
`;
