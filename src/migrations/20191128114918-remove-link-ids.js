'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.removeColumn('chats_users', 'id');
  },

  down(queryInterface, Sequelize) {
    return queryInterface.addColumn('chats_users', 'id', {
      primaryKey: true,
      type: Sequelize.UUID,
    });
  },
};
