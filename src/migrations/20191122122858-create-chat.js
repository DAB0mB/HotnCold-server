'use strict';

module.exports = {
  up(queryInterface, sequelize) {
    return queryInterface.createTable('chats', {
      id: {
        primaryKey: true,
        type: sequelize.UUID,
      },
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('chats');
  }
};
