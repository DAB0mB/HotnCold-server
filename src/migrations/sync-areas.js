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
      geoFeaturesIds: ['region.8593132391633450', 'region.12549636937738800'],
    },
    {
      name: 'Manhattan, New York, New York, United States',
      geoFeaturesIds: ['locality.12696928000137850'],
    },
    {
      name: 'San Francisco, California, United States',
      geoFeaturesIds: ['place.15734669613361910'],
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
