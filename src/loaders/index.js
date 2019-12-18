import DataLoader from 'dataloader';

import { batchChats } from './chat';
import { batchMessages } from './message';
import { batchUsers } from './user';

export const initLoaders = () => ({
  user: new DataLoader(keys =>
    batchUsers(keys),
  ),
  chat: new DataLoader(keys =>
    batchChats(keys),
  ),
  message: new DataLoader(keys =>
    batchMessages(keys),
  ),
});
