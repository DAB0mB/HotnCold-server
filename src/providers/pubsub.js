import * as container from '../container';

const $pubsub = Symbol('pubsub');

export const providerPubsub = (pubsub) => {
  container.set($pubsub, pubsub);
};

export const usePubsub = () => {
  return container.get($pubsub);
};
