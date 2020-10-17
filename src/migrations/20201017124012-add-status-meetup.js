export default {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('statuses', 'isMeetup', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  down(queryInterface) {
    return queryInterface.removeColumn('statuses', 'isMeetup');
  }
};
