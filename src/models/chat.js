import uuid from 'uuid';

const chat = (sequelize, DataTypes) => {
  const Chat = sequelize.define('chat', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
  });

  Chat.associate = (models) => {
    Chat.belongsToMany(models.Message, { through: 'chats_messages' });
    Chat.belongsToMany(models.User, { through: 'chats_users' });
  };

  return Chat;
};

export default chat;
