'use strict';

const tablesNames = ['users', 'statuses'];

module.exports = {
  up(queryInterface) {
    return Promise.all(tablesNames.map((tableName) => {
      return queryInterface.addIndex(tableName, ['location'], {
        using: 'GIST',
      });
    }));
  },

  down(queryInterface) {
    return Promise.all(tablesNames.map((tableName) => {
      return queryInterface.removeIndex(tableName, ['location']);
    }));
  },
};
