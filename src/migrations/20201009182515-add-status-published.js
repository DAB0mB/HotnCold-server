export default {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('statuses', 'published', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  down(queryInterface) {
    return queryInterface.removeColumn('statuses', 'published');
  }
};
