import { providePubsub } from '../providers';

const bootstrapPubsub = async (sequelize) => {
  const { PostgresPubSub } = require('graphql-postgres-subscriptions');

  const client = await sequelize.connectionManager.pool.acquire();
  const pubsub = new PostgresPubSub({ client });

  providePubsub(pubsub);
};

export default bootstrapPubsub;
