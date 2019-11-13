import 'dotenv/config';

import models from '../models';

const INTERVAL = 5 * 60 * 1000

const disposeOutdatedLocations = async ({ models }) => {
  return models.User.disposeOutdatedLocations().catch(e => console.error(e));
};

const startGarbageCollecting = (context) => {
  setInterval(() => {
    disposeOutdatedLocations(context);
  }, INTERVAL);

  disposeOutdatedLocations(context);
};

if (require.main === module) {
  startGarbageCollecting({ models });

  console.log('Started garbage collection...');
}

export default startGarbageCollecting;
