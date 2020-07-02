import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    associateNotificationsToken(token: String!): Boolean! @auth
    dissociateNotificationsToken: Boolean! @auth
  }
`;
