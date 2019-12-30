'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.createTable('contracts', {
        id: {
          primaryKey: true,
          type: Sequelize.UUID
        },
        userId: {
          foreignKey: true,
          type: Sequelize.UUID,
        },
        phone: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        passcode: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        verified: {
          type: Sequelize.BOOLEAN,
        },
        isTest: {
          type: Sequelize.BOOLEAN,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),

      queryInterface.addColumn('areas', 'phone', {
        allowNull: false,
        type: Sequelize.STRING
      }),

      queryInterface.addColumn('areas', 'countryCode', {
        allowNull: false,
        type: Sequelize.STRING
      }),
    ]);
  },

  down(queryInterface) {
    return Promise.all([
      queryInterface.dropTable('contracts'),
      queryInterface.removeColumn('areas', 'phone'),
      queryInterface.removeColumn('areas', 'countryCode'),
    ]);
  },
};
