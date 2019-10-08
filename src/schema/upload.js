import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    uploadPicture(data: Upload!): String!
  }
`;
