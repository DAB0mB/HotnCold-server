const statusUser = (sequelize, DataTypes) => {
  const StatusUser = sequelize.define('statuses_users', {
    isMock: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    isTest: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
    isAuthor: {
      type: DataTypes.BOOLEAN,
      defaultValue: () => false,
    },
  });

  return StatusUser;
};

export default statusUser;
