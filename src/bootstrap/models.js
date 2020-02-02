import { provideModels } from '../providers';

const bootstrapModels = (sequelize) => {
  const models = {
    Area: sequelize.import('../models/area'),
    ChatUser: sequelize.import('../models/chat_user'),
    Chat: sequelize.import('../models/chat'),
    Contract: sequelize.import('../models/contract'),
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
