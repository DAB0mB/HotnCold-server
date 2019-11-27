import { gql } from 'apollo-server-express';

export default gql`
  type Chat {
    id: ID!
    recentMessage: [Message]!
    users: [User]!
  }
`;
