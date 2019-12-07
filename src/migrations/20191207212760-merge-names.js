'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'firstName', 'name');

    await Promise.all([
      queryInterface.addColumn('users', 'isMock', {
        type: Sequelize.BOOLEAN,
      }),

      queryInterface.removeColumn('users', 'lastName'),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.renameColumn('users', 'name', 'firstName'),
      queryInterface.removeColumn('users', 'isMock'),
      queryInterface.addColumn('users', 'lastName', {
        type: Sequelize.STRING,
      }),
    ]);
  },
};
