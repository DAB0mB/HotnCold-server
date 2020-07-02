import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    userProfile(userId: ID): User @auth
  }

  extend type Mutation {
    createUser(name: String!, bio: String, occupation: String, birthDate: DateTime, pictures: [String]!): String!
    updateMyProfile(name: String!, bio: String, occupation: String, birthDate: DateTime, pictures: [String]!): User @auth
  }

  type User {
    id: ID!
    name: String!
    birthDate: DateTime @mine
    age: String
    occupation: String
    bio: String
    pictures: [String]
    avatar: String
  }
`;
