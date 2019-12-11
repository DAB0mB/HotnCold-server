'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'recentlyScannedAt', {
      type: Sequelize.DATE
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'recentlyScannedAt');
  },
};
