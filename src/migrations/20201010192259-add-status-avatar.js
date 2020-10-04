export default {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('statuses', 'avatar', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down(queryInterface) {
    return queryInterface.removeColumn('statuses', 'avatar');
  }
};
