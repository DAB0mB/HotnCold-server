'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('chats_messages', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      chatId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      messageId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('chats_messages');
  }
};
