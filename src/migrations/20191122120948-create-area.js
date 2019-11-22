'use strict';

module.exports = {
  up(queryInterface, sequelize) {
    return queryInterface.createTable('areas', {
      id: {
        primaryKey: true,
        type: sequelize.UUID,
      },
      name: {
        type: sequelize.STRING,
        allowNull: false,
      },
      pictures: {
        type: sequelize.ARRAY(sequelize.STRING),
        allowNull: false,
      },
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('areas');
  }
};
