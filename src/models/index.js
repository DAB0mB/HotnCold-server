import sequelize from '../sequelize';

const models = {
  Area: sequelize.import('./area'),
  User: sequelize.import('./user'),
  Chat: sequelize.import('./chat'),
  Message: sequelize.import('./message'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export default models;
