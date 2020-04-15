'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('areas', 'shortName', {
        type: Sequelize.STRING,
        allowNull: false,
      }),

      queryInterface.createTable('events', {
        id: {
          primaryKey: true,
          type: Sequelize.STRING,
        },
        areaId: {
          foreignKey: true,
          type: Sequelize.UUID,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.BLOB('tiny'),
          allowNull: false,
        },
        localDate: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        localTime: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        startsAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        endsAt: {
          type: Sequelize.DATE,
        },
        attendanceCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        location: {
          type: Sequelize.GEOMETRY('POINT'),
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        source: {
          type: Sequelize.STRING,
        },
        sourceLink: {
          type: Sequelize.STRING,
        },
        maxPeople: {
          type: Sequelize.INTEGER,
        },
        address: {
          type: Sequelize.STRING,
        },
        venueName: {
          type: Sequelize.STRING,
        },
        featuredPhoto: {
          type: Sequelize.STRING,
        },
      }),
    ]);
  },

  down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('areas', 'shortName'),
      queryInterface.dropTable('events'),
    ]);
  },
};
