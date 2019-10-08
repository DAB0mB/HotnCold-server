import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

class MineDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (user, args, context, info) {
      const { me } = context;

      if (!me) {
        throw Error('User must be logged in');
      }

      if (user.id !== me.id) {
        throw Error('Unauthorized');
      }

      return resolve.call(this, user, args, context, info);
    };
  }
}

export default MineDirective;
