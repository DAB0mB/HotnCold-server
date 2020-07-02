import uuid from 'uuid';

const chatSubscription = (sequelize, DataTypes) => {
  const ChatSubscription = sequelize.define('chats_subscriptions', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    isTest: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
  });

  ChatSubscription.associate = (models) => {
    ChatSubscription.belongsTo(models.Chat);
    ChatSubscription.belongsTo(models.User);
  };

  return ChatSubscription;
};

export default chatSubscription;
