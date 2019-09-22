import 'dotenv/config';

import * as mapbox from '../mapbox';
import models from '../models';
import sequelize from '../sequelize';

const { Area } = models;

export default async function syncAreas() {
  await Area.sync({ force: true });

  await Area.bulkCreate([
    {
      name: 'HaMerkaz, Israel',
      datasetId: 'ck0v9rtty01uu2it8pzf9et4u',
    },
    {
      name: 'Manhattan, New York, New York, United States',
      datasetId: 'ck0va0ovx027m2pky3f05u9yf',
    },
    {
      name: 'San Francisco, California, United States',
      datasetId: 'ck0vayndd02fb2qky6qgbjka5',
    },
  ]);
}

if (require.main === module) {
  syncAreas()
    .then(() => {
      console.log('Successfully synced areas!');

      process.exit(0);
    })
    .catch((e) => {
      console.error(e);

      process.exit(1);
    });
}
