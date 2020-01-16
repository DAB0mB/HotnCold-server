'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('contracts', 'verified', 'signed'),

      queryInterface.addColumn('users', 'notificationsToken', {
        type: Sequelize.STRING
      }),
    ]);
  },

  down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('users', 'notificationsToken'),
      queryInterface.renameColumn('contracts', 'signed', 'verified'),
    ]);
  },
};
