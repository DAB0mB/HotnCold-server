import { gql } from 'apollo-server-express';

export default gql`
  directive @auth on FIELD_DEFINITION
  directive @mine on FIELD_DEFINITION
`;
