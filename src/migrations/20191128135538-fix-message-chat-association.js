'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.dropTable('chats_messages'),

      queryInterface.addColumn('messages', 'chatId', {
        foreignKey: true,
        type: Sequelize.UUID,
      }),
    ]);
  },

  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.createTable('chats_messages', {
        chatId: {
          foreignKey: true,
          type: Sequelize.UUID,
        },
        messageId: {
          foreignKey: true,
          type: Sequelize.UUID,
        },
      }),

      queryInterface.removeColumn('messages', 'chatId'),
    ]);
  },
};
