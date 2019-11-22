'use strict';

module.exports = {
  up(queryInterface, sequelize) {
    return queryInterface.createTable('chats_users', {
      id: {
        primaryKey: true,
        type: sequelize.UUID,
      },
      chatId: {
        foreignKey: true,
        type: sequelize.UUID,
      },
      userId: {
        foreignKey: true,
        type: sequelize.UUID,
      },
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('chats_users');
  }
};
