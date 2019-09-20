import 'dotenv/config';

import * as mapbox from '../mapbox';
import models from '../models';
import sequelize from '../sequelize';

const { Region } = models;

export default async function syncRegions() {
  await Region.sync({ force: true });

  const datasets = await mapbox.datasets.listDatasets().send().then(({ body }) => body);

  await Region.bulkCreate(
    datasets.filter((d) =>
      d.name.startsWith('Users in ')
    )
    .map((d) => ({
      id: d.id,
      name: d.name.slice(9),
    }))
  );
}

if (require.main === module) {
  syncRegions()
    .then(() => {
      console.log('Successfully synced regions!');

      process.exit(0);
    })
    .catch((e) => {
      console.error(e);

      process.exit(1);
    });
}
