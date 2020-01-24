'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      birthDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      bio: {
        allowNull: false,
        type: Sequelize.STRING(511)
      },
      occupation: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pictures: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      location: {
        type: Sequelize.ARRAY(Sequelize.FLOAT),
      },
      areaId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
    });
  },

  down(queryInterface) {
    return queryInterface.dropTable('users');
  }
};
