'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('events', 'attendanceCount', 'sourceAttendanceCount');

    await queryInterface.createTable('events_attendees', {
      eventId: {
        foreignKey: true,
        type: Sequelize.STRING,
      },
      userId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.renameColumn('events', 'sourceAttendanceCount', 'attendanceCount');

    await queryInterface.dropTable('events_attendees');
  }
};
