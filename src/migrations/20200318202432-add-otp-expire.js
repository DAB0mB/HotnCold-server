'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('contracts', 'passcodeExpiresAt', {
      type: Sequelize.DATE,
    });
  },

  down(queryInterface) {
    return queryInterface.removeColumn('contracts', 'passcodeExpiresAt');
  },
};
