'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.createTable('statuses', {
        id: {
          primaryKey: true,
          type: Sequelize.UUID,
        },
        text: {
          allowNull: false,
          type: Sequelize.STRING(100),
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        expiresAt: {
          type: Sequelize.DATE,
        },
        location: {
          type: Sequelize.ARRAY(Sequelize.FLOAT),
        },
      }),

      queryInterface.addColumn('users', 'discoverable', {
        type: Sequelize.BOOLEAN,
      }),

      queryInterface.addColumn('users', 'statusId', {
        foreignKey: true,
        type: Sequelize.UUID,
      }),
    ]);
  },

  async down(queryInterface) {
    return Promise.all([
      queryInterface.dropTable('statuses'),
      queryInterface.removeColumn('users', 'discoverable'),
      queryInterface.removeColumn('users', 'statusId'),
    ]);
  }
};
