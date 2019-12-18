'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('chats', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
    });
  },

  down(queryInterface) {
    return queryInterface.dropTable('chats');
  }
};
