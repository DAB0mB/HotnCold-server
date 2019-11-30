import { PubSub } from 'apollo-server';

import { providePubsub } from '../providers';

const bootstrapPubsub = () => {
  providePubsub(new PubSub());
};

export default bootstrapPubsub;
