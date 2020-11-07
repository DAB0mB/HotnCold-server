import Pg from 'pg-promise';

import { provideDb } from '../providers';
import { freeText } from '../utils';

// TODO: Connect a single connection per request, and then dispose it on req.close
const bootstrapDb = () => {
  const db = Pg({
    query(e) {
      console.log('Executing (default):', freeText(e.query));
    },
  })(process.env.DATABASE_URL);

  return provideDb(db);
};

export default bootstrapDb;
