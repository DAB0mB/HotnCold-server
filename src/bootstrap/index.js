import bootstrapCloudinary from './cloudinary';
import bootstrapDb from './db';
import bootstrapFirebase from './firebase';
import bootstrapMapbox from './mapbox';
import bootstrapModels from './models';
import bootstrapPubsub from './pubsub';
import bootstrapTwilio from './twilio';

const bootstrap = () => {
  const Sequelize = require('sequelize');
  const config = require('../../sequelize_config');
  const sequelize = new Sequelize(process.env[config.use_env_variable], config);

  return Promise.all([
    bootstrapDb(),
    bootstrapCloudinary(),
    bootstrapMapbox(),
    bootstrapModels(sequelize),
    bootstrapPubsub(sequelize),
    bootstrapTwilio(),
    bootstrapFirebase(),
  ]);
};

export default bootstrap;
