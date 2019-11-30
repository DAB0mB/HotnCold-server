import { PubSub } from 'apollo-server';

import { providePubsub } from '../providers';

const bootstrapPubsub = () => {
  providePubsub(new Pubsub());
};

export default bootstrapPubsub;
