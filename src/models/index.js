import sequelize from '../sequelize';

const models = {
  Region: sequelize.import('./region'),
  User: sequelize.import('./user'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export default models;
