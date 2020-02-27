'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('statuses', 'isMock', {
        type: Sequelize.BOOLEAN,
      }),

      (async () => {
        await queryInterface.removeColumn('statuses', 'location');
        await queryInterface.addColumn('statuses', 'location', {
          type: Sequelize.GEOMETRY('POINT'),
        });
      })(),

      queryInterface.renameColumn('statuses', 'expiresAt', 'locationExpiresAt'),

      queryInterface.addColumn('statuses', 'areaId', {
        foreignKey: true,
        type: Sequelize.UUID,
      }),

      (async () => {
        await queryInterface.removeColumn('users', 'location');
        await queryInterface.addColumn('users', 'location', {
          type: Sequelize.GEOMETRY('POINT'),
        });
      })(),

      queryInterface.addColumn('users', 'locationExpiresAt', {
        type: Sequelize.DATE,
      }),

      queryInterface.removeColumn('users', 'recentlyScannedAt'),
    ]);
  },

  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('statuses', 'isMock'),

      (async () => {
        await queryInterface.removeColumn('statuses', 'location');
        await queryInterface.addColumn('statuses', 'location', {
          type: Sequelize.ARRAY(Sequelize.FLOAT),
        });
      })(),

      queryInterface.renameColumn('statuses', 'locationExpiresAt', 'expiresAt'),

      queryInterface.removeColumn('statuses', 'areaId'),

      (async () => {
        await queryInterface.removeColumn('users', 'location');
        await queryInterface.addColumn('users', 'location', {
          type: Sequelize.ARRAY(Sequelize.FLOAT),
        });
      })(),

      queryInterface.removeColumn('users', 'locationExpiresAt'),

      queryInterface.addColumn('users', 'recentlyScannedAt', {
        type: Sequelize.DATE,
      }),
    ]);
  }
};
