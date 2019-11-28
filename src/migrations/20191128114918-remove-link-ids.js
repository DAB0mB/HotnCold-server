'use strict';

const tables = ['chats_users', 'chats_messages'];

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all(tables.map((table) => {
      return queryInterface.removeColumn(table, 'id');
    }));
  },

  down(queryInterface, Sequelize) {
    return Promise.all(tables.map((table) => {
      return queryInterface.addColumn(table, 'id', {
        primaryKey: true,
        type: Sequelize.UUID,
      });
    }));
  },
};
