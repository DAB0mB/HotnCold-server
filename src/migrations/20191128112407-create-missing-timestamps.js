'use strict';

const tables = ['users', 'areas', 'messages', 'chats', 'chats_users'];

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all(tables.map((table) => {
      return Promise.all([
        queryInterface.addColumn(table, 'createdAt', {
          allowNull: false,
          type: Sequelize.DATE
        }),

        queryInterface.addColumn(table, 'updatedAt', {
          allowNull: false,
          type: Sequelize.DATE
        }),
      ]);
    }));
  },

  down(queryInterface) {
    return Promise.all(tables.map((table) => {
      return Promise.all([
        queryInterface.removeColumn(table, 'createdAt'),
        queryInterface.removeColumn(table, 'updatedAt'),
      ]);
    }));
  },
};
