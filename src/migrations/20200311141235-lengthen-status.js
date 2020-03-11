'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('statuses', 'text', {
      allowNull: false,
      type: Sequelize.STRING(150),
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('statuses', 'text', {
      allowNull: false,
      type: Sequelize.STRING(100),
    });
  }
};
