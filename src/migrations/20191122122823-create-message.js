'use strict';

module.exports = {
  up(queryInterface, sequelize) {
    return queryInterface.createTable('messages', {
      id: {
        primaryKey: true,
        type: sequelize.UUID,
      },
      text: {
        type: sequelize.STRING,
        allowNull: false,
      },
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('messages');
  }
};
