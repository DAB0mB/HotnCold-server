import { parsePhoneNumberFromString } from 'libphonenumber-js';
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    geoFeaturesIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  });

  Area.associate = (models) => {
    Area.hasMany(models.User);
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

  return Area;
};

export default area;
