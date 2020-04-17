'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('statuses', null);

    await queryInterface.removeColumn('statuses', 'locationExpiresAt');

    await queryInterface.changeColumn('statuses', 'location', {
      type: Sequelize.GEOMETRY('POINT'),
      allowNull: false,
    });

    await queryInterface.addColumn('statuses', 'publishedAt', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.addColumn('statuses', 'userId', {
      foreignKey: true,
      type: Sequelize.UUID,
    });

    await queryInterface.removeColumn('users', 'discoverable');
    await queryInterface.removeColumn('users', 'statusId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('statuses', 'locationExpiresAt', {
      type: Sequelize.DATE,
    }),

    await queryInterface.changeColumn('statuses', 'location', {
      type: Sequelize.GEOMETRY('POINT'),
    });

    await queryInterface.removeColumn('statuses', 'publishedAt');
    await queryInterface.removeColumn('statuses', 'userId');

    await queryInterface.addColumn('users', 'discoverable', {
      type: Sequelize.BOOLEAN,
    });

    await queryInterface.addColumn('users', 'statusId', {
      foreignKey: true,
      type: Sequelize.UUID,
    });
  },
};
