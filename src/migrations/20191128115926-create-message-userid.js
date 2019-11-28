'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('messages', 'userId', {
      foreignKey: true,
      type: Sequelize.UUID,
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('messages', 'userId');
  },
};
