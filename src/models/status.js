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
    },
    locationExpiresAt: {
      type: DataTypes.DATE,
    },
    isMock: {
      type: DataTypes.BOOLEAN,
    },
  });

  Status.associate = (models) => {
    Status.belongsTo(models.Area);
    Status.hasOne(models.User);
  };

  Location.extend(Status, {
    locationTimeout: Number(process.env.STATUS_LOCATION_TIMEOUT)
  });

  return Status;
};

export default status;
