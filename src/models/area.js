import uuid from 'uuid';

const area = (sequelize) => {
  const Area = sequelize.define('area', {
    id: {
      primaryKey: true,
      type: sequelize.UUID,
      defaultValue: () => uuid(),
    },
    name: {
      type: sequelize.STRING,
      allowNull: false,
    },
    geoFeaturesIds: {
      type: sequelize.ARRAY(sequelize.STRING),
      allowNull: false,
    },
  });

  Area.associate = (models) => {
    Area.hasMany(models.User);
  };

  return Area;
};

export default area;
