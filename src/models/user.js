import uuid from 'uuid';

import { useModels } from '../providers';
import { Location } from './mixins';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notificationsToken: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.STRING(511),
      allowNull: false,
    },
    pictures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      validate: {
        len(value) {
          if (value.length < 1) {
            throw Error('User must have at least a single picture');
          }

          if (value.length > 6) {
            throw Error('User must have 6 pictures at most');
          }
        },
      },
    },
    discoverable: {
      type: DataTypes.BOOLEAN
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

  User.associate = (models) => {
    User.belongsTo(models.Area);
    User.belongsToMany(models.Chat, { through: models.ChatUser });
    User.hasMany(models.Message);
    User.hasOne(models.Contract);
    User.belongsTo(models.Status);
  };

  User.prototype.getContract = function getContract(options = {}) {
    const { Contract } = useModels();

    return Contract.find({
      ...options,
      where: { userId: this.id },
    });
  };

  Location.extend(User, {
    locationTimeout: Number(process.env.USER_LOCATION_TIMEOUT),
  });

  return User;
};

export default user;
