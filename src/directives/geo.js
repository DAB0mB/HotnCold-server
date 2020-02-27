import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = function (parent, args, context, info) {
      const { me } = context;

      if (new Date(me.locationExpiresAt) < new Date()) {
        throw Error('Cannot perform action because your location has expired.');
      }

      return resolve.call(this, parent, args, context, info);
    };
  }
}

export default AuthDirective;
