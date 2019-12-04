import bootstrapCloudinary from './cloudinary';
import bootstrapMapbox from './mapbox';
import bootstrapModels from './models';
import bootstrapPubsub from './pubsub';
import bootstrapServices from './services';

const bootstrap = () => {
  const Sequelize = require('sequelize');
  const config = require('../../sequelize_config');
  const sequelize = new Sequelize(process.env[config.use_env_variable], config);

  return Promise.all([
    bootstrapCloudinary(),
    bootstrapMapbox(),
    bootstrapModels(sequelize),
    bootstrapPubsub(sequelize),
    bootstrapServices(),
  ]);
};

export default bootstrap;
