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
        type: Sequelize.DATE
      },
      pictures: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      location: {
        type: Sequelize.ARRAY(Sequelize.FLOAT),
      },
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
