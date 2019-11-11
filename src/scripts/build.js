#!/usr/bin/env node
import syncAreas from '../migrations/sync-areas';
import models from '../models';

async function build() {
  Object.keys(models).forEach(key => {
    models[key].sync();
  });

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
