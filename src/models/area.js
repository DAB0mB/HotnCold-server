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
    geoFeaturesIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  });

  Area.associate = (models) => {
    Area.hasMany(models.User);
  };

  return Area;
};

export default area;
