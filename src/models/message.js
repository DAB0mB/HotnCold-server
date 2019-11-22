import uuid from 'uuid';

const message = (sequelize) => {
  const Message = sequelize.define('message', {
    id: {
      primaryKey: true,
      type: sequelize.UUID,
      defaultValue: () => uuid(),
    },
    text: {
      type: sequelize.STRING,
      allowNull: false,
    },
  });

  Message.associate = (models) => {
    Message.hasOne(models.Chat, { through: 'chat_messages' });
    Message.belongsTo(models.User);
  };

  return Message;
};

export default message;
