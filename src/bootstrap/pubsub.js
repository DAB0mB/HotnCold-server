import { PostgresPubSub } from 'graphql-postgres-subscriptions';

import { providePubsub } from '../providers';

const bootstrapPubsub = async (sequelize) => {
  const client = await sequelize.connectionManager.pool.acquire();

  providePubsub(new PostgresPubSub({ client }));
};

export default bootstrapPubsub;
