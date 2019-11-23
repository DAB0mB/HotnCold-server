import { provideModels } from '../provides'

const bootstrapModels = () => {
  const Sequelize = require('sequelize');

  const config = require('../../sequelize_config');

  const sequelize = new Sequelize(process.env[config.use_env_variable], config);

  const models = {
    Area: sequelize.import('../models/area'),
    Chat: sequelize.import('../models/chat'),
    Message: sequelize.import('../models/message'),
    User: sequelize.import('../models/user'),
  };

  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  provideModels(models);
};

export default bootstrapModels;
