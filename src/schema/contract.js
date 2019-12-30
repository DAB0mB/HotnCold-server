import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    myContract: Contract
  }

  extend type Mutation {
    findOrCreateContract(phone: String!): Contract!
    verifyContract(contractId: ID!, passcode: String!): Contract!
  }

  type Contract {
    id: ID!
    phone: String!
    isTest: Boolean
    verified: Boolean
    passcode: String
  }
`;
