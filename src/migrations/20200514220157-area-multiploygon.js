'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('areas', null);

    await queryInterface.changeColumn('areas', 'polygon', {
      allowNull: false,
      type: Sequelize.GEOMETRY('MULTIPOLYGON'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('areas', null);

    await queryInterface.changeColumn('areas', 'polygon', {
      allowNull: false,
      type: Sequelize.GEOMETRY('POLYGON'),
    });
  },
};
