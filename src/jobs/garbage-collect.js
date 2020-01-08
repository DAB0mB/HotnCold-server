import 'dotenv/config';

import bootstrap from '../bootstrap';
import { useModels } from '../providers';

const disposeOutdatedLocations = async () => {
  const { User } = useModels();

  return User.disposeOutdatedLocations().catch(e => console.error(e));
};

const startGarbageCollecting = () => {
  setInterval(() => {
    disposeOutdatedLocations();
  }, process.env.ACTIVE_TIME);

  disposeOutdatedLocations();
};

if (require.main === module) {
  bootstrap().then(() => {
    startGarbageCollecting();

    console.log('Started garbage collection...');
  }).catch((e) => {
    console.error('Failed to bootstrap :(');
    console.error(e);

    process.exit(1);
  });
}

export default startGarbageCollecting;
