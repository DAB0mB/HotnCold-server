import 'dotenv/config';

import bootstrap from '../bootstrap';
import { useModels } from '../providers';

const syncMeetupEvents = async () => {
  const { Event } = useModels();

  try {
    await Event.syncMeetupEvents();

    console.log('Sync iteration done');
  }
  catch (e) {
    console.error(e);
  }
};

const startSyncingMeetupEvents = (init) => {
  const interval = setInterval(syncMeetupEvents, Number(process.env.MEETUP_SYNC_INTERVAL));

  if (init) {
    syncMeetupEvents();
  }

  return interval;
};

if (require.main === module) {
  bootstrap().then(() => {
    startSyncingMeetupEvents(true);

    console.log('Started syncing Meetup.com events...');
  }).catch((e) => {
    console.error('Failed to bootstrap :(');
    console.error(e);

    process.exit(1);
  });
}

export default startSyncingMeetupEvents;
