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
      validate: {
        notEmpty: true,
      },
    },
    datasetId: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    geoFeaturesIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      validate: {
        notEmpty: true,
      },
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['name', 'datasetId'],
      }
    ]
  });

  Area.associate = (models) => {
    Area.hasMany(models.User);
  };

  return Area;
};

export default area;
