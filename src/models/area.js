import turfBbox from '@turf/bbox';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import Sequelize from 'sequelize';
import uuid from 'uuid';

const area = (sequelize, DataTypes) => {
  const Area = sequelize.define('area', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    polygon: {
      type: DataTypes.GEOMETRY('MULTIPOLYGON'),
      allowNull: false,
    },
    bbox: {
      type: DataTypes.ARRAY(DataTypes.FLOAT),
      allowNull: true,
      validate: {
        len: 4,
      },
    },
    center: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
    },
  });

  Area.defaultPhone = '+14157993599';

  Area.associate = (models) => {
    Area.hasMany(models.Status);
  };

  Area.findByCountryCode = (phone) => {
    const jsPhone = parsePhoneNumberFromString(phone);

    if (!jsPhone) return;

    return Area.findOne({
      where: {
        countryCode: jsPhone.countryCallingCode
      },
    });
  };

  Area.findByLocation = (location) => {
    return Area.findOne({
      where: Sequelize.where(Sequelize.fn('ST_Contains', Sequelize.col('area.polygon'), Sequelize.fn('ST_MakePoint', ...location)), true),
    });
  };

  Area.prototype.getBBox = async function () {
    if (!this.bbox) {
      this.bbox = turfBbox(this.polygon);
      await this.save();
    }

    return this.bbox;
  };

  return Area;
};

export default area;
