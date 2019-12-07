import uuid from 'uuid';

import { useModels, useMapbox } from '../providers';

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
    // gender: {
    //   type: DataTypes.STRING,
    //   validate: {
    //     notEmpty: true,
    //   },
    // },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: false,
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
    location: {
      type: DataTypes.ARRAY(DataTypes.FLOAT),
      validate: {
        len: 2,
      },
    },
  }, {
    hooks: {
      beforeDestroy: (instance) => {
        instance.setLocation(null, true);
      },
    },
  });

  User.associate = (models) => {
    User.belongsTo(models.Area);
    User.hasMany(models.Message);
    User.belongsToMany(models.Chat, { through: 'chats_users' });
  };

  User.disposeOutdatedLocations = (dateLimit = new Date(Date.now())) => {
    return User.update({
      location: null,
      areaId: null,
    }, {
      where: {
        updatedAt: { $lt: dateLimit },
        isMock: { $ne: true },
        $or: [
          {
            location: { $ne: null },
          },
          {
            areaId: { $ne: null },
          },
        ],
      },
    });
  };

  // Set location + qualify under a certain place (e.g. San Francisco, California, United States)
  User.prototype.setLocation = async function setLocation(location, useStage) {
    const { Area } = useModels();
    const mapbox = useMapbox();
    const selfLocation = this.getDataValue('location');

    if (location) {
      if (
        selfLocation &&
        selfLocation[0] === location[0] &&
        selfLocation[1] === location[1]
      ) {
        return;
      }
      await this.setLocation(null, true);

      const geoFeaturesIds = await mapbox.geocoding.reverseGeocode({
        query: location,
        types: ['region', 'district', 'locality', 'place'],
      }).send().then(({ body }) => body.features.map(f => f.id));

      // Area might be available from join op
      const area = await Area.findOne({
        where: {
          geoFeaturesIds: {
            $overlap: geoFeaturesIds,
          },
        },
      });

      if (area) {
        await this.setArea(area);
      } else {
        await this.setArea(null);
      }

      this.setDataValue('location', location);
    } else {
      if (!selfLocation) return;

      await this.setArea(null);

      this.setDataValue('location', null);
    }

    if (!useStage) {
      await this.save();
    }
  };

  return User;
};

export default user;
