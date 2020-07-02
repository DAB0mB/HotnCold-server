import { provideModels } from '../providers';

const bootstrapModels = (sequelize) => {
  const models = {
    Area: sequelize.import('../models/area'),
    ChatUser: sequelize.import('../models/chat_user'),
    ChatSubscription: sequelize.import('../models/chat_subscription'),
    StatusUser: sequelize.import('../models/status_user'),
    Chat: sequelize.import('../models/chat'),
    Contract: sequelize.import('../models/contract'),
    Message: sequelize.import('../models/message'),
    User: sequelize.import('../models/user'),
    Status: sequelize.import('../models/status'),
  };

  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  provideModels(models);
};

export default bootstrapModels;
