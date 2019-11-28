import uuid from 'uuid';

const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Chat);
    Message.belongsTo(models.User);
  };

  return Message;
};

export default message;
