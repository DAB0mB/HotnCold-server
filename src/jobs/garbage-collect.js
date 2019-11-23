import 'dotenv/config';

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
  startGarbageCollecting();

  console.log('Started garbage collection...');
}

export default startGarbageCollecting;
