export default {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('messages', 'text', {
      type: Sequelize.STRING(1023),
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('messages', 'text', {
      type: Sequelize.STRING,
    });
  }
};
