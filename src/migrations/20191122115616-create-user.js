'use strict';

module.exports = {
  up(queryInterface, sequelize) {
    return queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        type: sequelize.UUID,
      },
      firstName: {
        allowNull: false,
        type: sequelize.STRING
      },
      lastName: {
        allowNull: false,
        type: sequelize.STRING
      },
      birthDate: {
        allowNull: false,
        type: sequelize.DATE
      },
      bio: {
        allowNull: false,
        type: sequelize.DATE
      },
      pictures: {
        type: sequelize.ARRAY(sequelize.STRING),
      },
      location: {
        type: sequelize.ARRAY(sequelize.FLOAT),
      },
      createdAt: {
        allowNull: false,
        type: sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: sequelize.DATE
      },
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
