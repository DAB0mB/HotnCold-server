'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('areas', 'polygon', {
        allowNull: false,
        type: Sequelize.GEOMETRY('POLYGON'),
      }),

      queryInterface.addColumn('areas', 'center', {
        allowNull: false,
        type: Sequelize.GEOMETRY('POINT'),
      }),

      queryInterface.removeColumn('areas', 'geoFeaturesIds'),
    ]);
  },

  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('areas', 'polygon'),
      queryInterface.removeColumn('areas', 'center'),

      queryInterface.addColumn('areas', 'geoFeaturesIds', {
        allowNull: false,
        type: Sequelize.GEOMETRY('POINT'),
      }),
    ]);
  },
};
