import uuid from 'uuid';

const comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comment', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    text: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Event);
    Comment.belongsTo(models.User);
  };

  return Comment;
};

export default comment;
