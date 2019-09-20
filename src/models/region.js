import uuid from 'uuid';

const region = (sequelize, DataTypes) => {
  const Region = sequelize.define('region', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['name'],
      }
    ]
  });

  Region.associate = (models) => {
    Region.hasMany(models.User);
  };

  return Region;
};

export default region;
