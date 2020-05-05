import { provideModels } from '../providers';

const bootstrapModels = (sequelize) => {
  const models = {
    Area: sequelize.import('../models/area'),
    ChatUser: sequelize.import('../models/chat_user'),
    Chat: sequelize.import('../models/chat'),
    Comment: sequelize.import('../models/comment'),
    Contract: sequelize.import('../models/contract'),
    Event: sequelize.import('../models/event'),
    EventAttendee: sequelize.import('../models/event_attendee'),
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
