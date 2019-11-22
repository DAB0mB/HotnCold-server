import Sequelize from 'sequelize';

import config from '../../sequelize_config';

const sequelize = new Sequelize(process.env[config.use_env_variable], config);

const models = {
  Area: sequelize.import('./area'),
  Chat: sequelize.import('./chat'),
  Message: sequelize.import('./message'),
  User: sequelize.import('./user'),
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
