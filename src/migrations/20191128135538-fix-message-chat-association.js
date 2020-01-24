'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('messages', 'chatId', {
      foreignKey: true,
      type: Sequelize.UUID,
    });
  },

  down(queryInterface) {
    return queryInterface.removeColumn('messages', 'chatId');
  },
};
