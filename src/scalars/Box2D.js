import { GraphQLScalarType, GraphQLError } from 'graphql';

import parseLiteral from './parseLiteral';
import { validate as validateVector2D } from './Vector2D';

export const validate = (value) => {
  if (!(value instanceof Array)) {
    throw new GraphQLError('Box2D: Provided value must be an array');
  }

  if (value.length !== 2) {
    throw new GraphQLError('Box2D: Provided value must have a length of 2');
  }

  return value.map(validateVector2D);
};

export default new GraphQLScalarType({
  name: 'Box2D',
  serialize: validate,
  parseValue: validate,
  parseLiteral: ast => validate(parseLiteral(ast)),
});
