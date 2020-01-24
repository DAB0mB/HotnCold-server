'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'notificationsToken', {
      type: Sequelize.STRING
    });
  },

  down(queryInterface) {
    return queryInterface.removeColumn('users', 'notificationsToken');
  },
};
