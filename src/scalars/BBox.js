import { GraphQLScalarType, GraphQLError } from 'graphql';

import parseLiteral from './parseLiteral';

export const validate = (value) => {
  if (!(value instanceof Array)) {
    throw new GraphQLError('BBox: Provided value must be an array');
  }

  if (value.length !== 4) {
    throw new GraphQLError('BBox: Provided value must have a length of 2');
  }

  value = value.map(Number);

  for (let v of value) {
    if (Number.isNaN(v)) {
      throw new GraphQLError('BBox: All values must represent a number');
    }
  }

  return value;
};

export default new GraphQLScalarType({
  name: 'BBox',
  serialize: validate,
  parseValue: validate,
  parseLiteral: ast => validate(parseLiteral(ast)),
});
