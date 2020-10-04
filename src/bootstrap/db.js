import Pg from 'pg-promise';

import { provideDb } from '../providers';

// TODO: Connect a single connection per request, and then dispose it on req.close
const bootstrapDb = () => {
  const db = Pg()(process.env.DATABASE_URL);

  return provideDb(db);
};

export default bootstrapDb;
