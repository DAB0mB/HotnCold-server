export default {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn('areas', 'bbox', {
          type: Sequelize.ARRAY(Sequelize.FLOAT),
          allowNull: true,
        }, {
          transaction
        }),
      ]);
    });
  },

  down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('areas', 'bbox', {
          transaction
        }),
      ]);
    });
  }
};
