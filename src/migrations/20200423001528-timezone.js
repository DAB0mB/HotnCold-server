'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('statuses', null);
    await queryInterface.bulkDelete('areas', null);

    await queryInterface.addColumn('areas', 'timezone', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('areas', 'timezone');
  },
};
