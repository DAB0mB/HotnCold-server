'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('statuses', 'isTest', {
      type: Sequelize.BOOLEAN,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('statuses', 'isTest');
  },
};
