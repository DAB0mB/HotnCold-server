import sequelize from '../sequelize';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gender: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    birthDate: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    occupation: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    bio: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    location: {
      type: DataTypes.ARRAY(DataTypes.FLOAT),
      unique: false,
      allowNull: true,
      validate: {
        notEmpty: true,
        is2D(value) {
          if (value.length != 2) {
            throw Error('A location vector must contain 2 coordinates');
          }
        }
      },
    },
    pictures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      unique: false,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    }
  });

  return User;
};

export default user;
