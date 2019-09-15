import bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    age: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    job: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bio: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    pictures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  });

  User.findLatest = async function () {
    const users = await User.findAll({
      limit: 1,
      where: {},
      order: [[ 'createdAt', 'DESC' ]],
    });

    return users[0];
  };

  return User;
};

export default user;
