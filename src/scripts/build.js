import 'dotenv/config';

import syncAreas from '../seeders/sync-areas';
import sequelize from '../sequelize';

async function build() {
  await sequelize.sync();
  await syncAreas();
}

if (require.main === module) {
  build()
    .then(() => {
      console.log('Successfully built!');

      process.exit(0);
    })
    .catch((e) => {
      console.error(e);

      process.exit(1);
    });
}
