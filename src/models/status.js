import uuid from 'uuid';

const status = (sequelize, DataTypes) => {
  const Status = sequelize.define('status', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    text: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    location: {
      type: DataTypes.ARRAY(DataTypes.FLOAT),
      validate: {
        len: 2,
      },
    },
    expiresAt: {
      type: DataTypes.DATE,
    }
  });

  Status.associate = (models) => {
    Status.hasOne(models.User);
  };

  return Status;
};

export default status;
