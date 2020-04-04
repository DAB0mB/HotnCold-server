import bootstrapCloudinary from './cloudinary';
import bootstrapFirebase from './firebase';
import bootstrapMapbox from './mapbox';
import bootstrapMeetup from './meetup';
import bootstrapModels from './models';
import bootstrapPubsub from './pubsub';
import bootstrapTwilio from './twilio';
import bootstrapWhitelist from './whitelist';

const bootstrap = () => {
  const Sequelize = require('sequelize');
  const config = require('../../sequelize_config');
  const sequelize = new Sequelize(process.env[config.use_env_variable], config);

  return Promise.all([
    bootstrapCloudinary(),
    bootstrapMeetup(),
    bootstrapMapbox(),
    bootstrapModels(sequelize),
    bootstrapPubsub(sequelize),
    bootstrapTwilio(),
    bootstrapWhitelist(),
    bootstrapFirebase(),
  ]);
};

export default bootstrap;
