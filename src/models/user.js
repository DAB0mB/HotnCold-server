import uuid from 'uuid';

import * as mapbox from '../mapbox';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    // gender: {
    //   type: DataTypes.STRING,
    //   validate: {
    //     notEmpty: true,
    //   },
    // },
    birthDate: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: true,
      },
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING(511),
      allowNull: true,
    },
    pictures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
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
      allowNull: true,
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
  };

  User.disposeOutdatedLocations = (dateLimit = new Date(Date.now())) => {
    return User.update({
      location: null,
      areaId: null,
    }, {
      where: {
        updatedAt: { $lt: dateLimit },
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
    const selfLocation = this.getDataValue('location');
    const Area = sequelize.models.area;

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
            [sequelize.Op.overlap]: geoFeaturesIds,
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
