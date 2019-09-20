import uuid from 'uuid';

import * as mapbox from '../mapbox';
import { Mutex } from '../utils';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      primaryKey: true,
      allowNull: false,
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
    region: {
      type: DataTypes.STRING,
      allowNull: true,
      set() {
        throw Error('Use User.setLocation() instead');
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
  });

  // Set location + qualify under a certain place (e.g. San Francisco, California, United States)
  User.prototype.setLocation = async function setLocation(location) {
    const selfLocation = this.getDataValue('location');
    const Region = sequelize.models.region;

    if (location) {
      if (
        selfLocation &&
        selfLocation[0] === location[0] &&
        selfLocation[1] === location[1]
      ) {
        return;
      }

      const place = await mapbox.geocoding.reverseGeocode({
        query: location,
        types: ['place'],
        limit: 1,
      }).send().then(({ body }) => body.features[0]);

      let region = await Region.findOne({
        where: { name: place.place_name }
      });

      if (!region) {
        const mutex = new Mutex(place.place_name);

        if (mutex.opened) {
          mutex.lock();

          const dataset = await mapbox.datasets.createDataset({
            name: `Users in ${place.place_name}`,
          }).send().then(({ body }) => body);

          region = await Region.create({
            id: dataset.id,
            name: place.place_name,
          });

          mutex.open();
        } else {
          await mutex.opening;

          region = await Region.findOne({
            where: { name: place.place_name }
          });
        }
      }

      this.setDataValue('location', location);
      this.setDataValue('region', region.id);

      const puttingFeature = mapbox.datasets.putFeature({
        datasetId: region.id,
        featureId: this.id,
        feature: {
          type: 'Feature',
          properties: {
            entity: 'user',
            user: this.id,
          },
          geometry: {
            type: 'Point',
            coordinates: location,
          }
        },
      }).send();

      await Promise.all([
        puttingFeature,
        this.save(),
      ]);
    } else {
      if (!selfLocation) return;

      this.setDataValue('location', null);
      this.setDataValue('region', null);

      await this.save();
    }
  };

  return User;
};

export default user;
