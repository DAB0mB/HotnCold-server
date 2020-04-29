'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('events_attendees', {
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

  down(queryInterface) {
    return queryInterface.dropTable('events_attendees');
  }
};
