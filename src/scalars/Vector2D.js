import { GraphQLScalarType, GraphQLError } from 'graphql';

import parseLiteral from './parseLiteral';

export const validate = (value) => {
  if (!(value instanceof Array)) {
    throw new GraphQLError('Vector2D: Provided value must be an array');
  }

  if (value.length !== 2) {
    throw new GraphQLError('Vector2D: Provided value must have a length of 2');
  }

  value = value.map(Number);

  for (let v of value) {
    if (Number.isNaN(v)) {
      throw new GraphQLError('Vector2D: All values must represent a number');
    }
  }

  return value;
};

export default new GraphQLScalarType({
  name: 'Vector2DScalar',
  serialize: validate,
  parseValue: validate,
  parseLiteral: ast => validate(parseLiteral(ast)),
});
