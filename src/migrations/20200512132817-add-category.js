'use strict';

const { Source } = require('../models/event/enums');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('events', null);

    await queryInterface.changeColumn('events', 'source', {
      type: Sequelize.ENUM(Object.values(Source)),
      allowNull: false,
    });

    await queryInterface.addColumn('events', 'category', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.removeColumn('events', 'localTime');
    await queryInterface.removeColumn('events', 'localDate');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('events', null);

    await queryInterface.changeColumn('events', 'source', {
      type: Sequelize.STRING,
    });
    await queryInterface.sequelize.query('DROP TYPE "enum_events_source";');

    await queryInterface.removeColumn('events', 'category');

    await queryInterface.addColumn('events', 'localTime', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('events', 'localDate', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
