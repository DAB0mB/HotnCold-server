import uuid from 'uuid';

const chat = (sequelize, DataTypes) => {
  const Chat = sequelize.define('chat', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    isThread: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    isListed: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    bumpedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isTest: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    isMock: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
  });

  Chat.associate = (models) => {
    Chat.hasMany(models.Message);
    Chat.hasOne(models.Status);
    Chat.belongsToMany(models.User, { through: models.ChatUser, as: 'users' });
  };

  return Chat;
};

export default chat;
