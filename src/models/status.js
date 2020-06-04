import uuid from 'uuid';

const status = (sequelize, DataTypes) => {
  const Status = sequelize.define('status', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
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

  Status.associate = (models) => {
    Status.belongsTo(models.Area);
    Status.belongsTo(models.Chat);
    Status.belongsToMany(models.User, { through: models.StatusUser, as: 'users' });
  };

  return Status;
};

export default status;