import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (parent, args, context, info) {
      const { me } = context;

      if (!me) {
        throw Error('User must be logged in');
      }

      return resolve.call(this, parent, args, context, info);
    };
  }
}

export default AuthDirective;
