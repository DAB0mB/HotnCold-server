'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('users', 'avatar', {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('users', 'avatar'),
    ]);
  },
};
