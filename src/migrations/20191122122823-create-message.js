'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('messages', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  down(queryInterface) {
    return queryInterface.dropTable('messages');
  }
};
