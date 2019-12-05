import 'dotenv/config';

import { bootstrap } from '../bootstrap';
import { useModels } from '../providers';

const INTERVAL = 10 * 60 * 1000

const disposeOutdatedLocations = async () => {
  const { User } = useModels();

  return models.User.disposeOutdatedLocations().catch(e => console.error(e));
};

const startGarbageCollecting = () => {
  setInterval(() => {
    disposeOutdatedLocations();
  }, INTERVAL);

  disposeOutdatedLocations();
};

if (require.main === module) {
  bootstrap().then(() => {
    startGarbageCollecting();

    console.log('Started garbage collection...');
  }).catch((e) => {
    console.error('Failed to bootstrap.');

    process.exit(1);
  });
}

export default startGarbageCollecting;
