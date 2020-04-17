import uuid from 'uuid';

import { Location } from './mixins';

const status = (sequelize, DataTypes) => {
  const Status = sequelize.define('status', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    text: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isTest: {
      type: DataTypes.BOOLEAN,
    },
    isMock: {
      type: DataTypes.BOOLEAN,
    },
  });

  Status.associate = (models) => {
    Status.belongsTo(models.Area);
    Status.belongsTo(models.User);
  };

  Location.extend(Status);

  return Status;
};

export default status;
