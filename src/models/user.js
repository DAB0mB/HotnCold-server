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
    gender: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    birthDate: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pictures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    pictures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      validate: {
        len: 2,
      },
    },
    location: {
      type: DataTypes.ARRAY(DataTypes.FLOAT),
      allowNull: true,
      validate: {
        len: 2,
      },
      set() {
        throw Error('Use User.setLocation() instead');
      },
    },
  }, {
    hooks: {
      beforeDestroy: async (instance) => {
        // Will be performed in background
        const area = await instance.getArea();

        if (area) {
          await mapbox.datasets.deleteFeature({
            datasetId: area.datasetId,
            featureId: `user.${instance.id}`,
          }).send();
        }
      },
    },
  });

  User.associate = (models) => {
    User.belongsTo(models.Area);
  };

  // Set location + qualify under a certain place (e.g. San Francisco, California, United States)
  User.prototype.setLocation = async function setLocation(location) {
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

      const placeNames = await mapbox.geocoding.reverseGeocode({
        query: location,
        types: ['region', 'district', 'locality', 'place'],
      }).send().then(({ body }) => body.features.map(f => f.place_name));

      const area = await Area.findOne({
        where: { name: placeNames }
      });

      if (area) {
        await mapbox.datasets.putFeature({
          datasetId: area.datasetId,
          featureId: `user.${this.id}`,
          feature: {
            type: 'Feature',
            properties: this.toJSON(),
            geometry: {
              type: 'Point',
              coordinates: location,
            }
          },
        }).send();

        await this.setArea(area);
      } else {
        await this.setArea(null);
      }

      this.setDataValue('location', location);
    } else {
      if (!selfLocation) return;

      const area = await this.getArea();

      if (area) {
        await mapbox.datasets.deleteFeature({
          datasetId: area.datasetId,
          featureId: `user.${this.userid}`,
        }).send();
      }

      this.setDataValue('areaId', null);
      this.setDataValue('location', null);
    }

    await this.save();
  };

  return User;
};

export default user;
