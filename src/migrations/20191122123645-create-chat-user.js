'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('chats_users', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      chatId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      userId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
    });
  },

  down(queryInterface) {
    return queryInterface.dropTable('chats_users');
  }
};
