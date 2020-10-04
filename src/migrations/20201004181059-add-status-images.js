export default {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn('statuses', 'images', {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true,
        }, {
          transaction
        }),

        queryInterface.addColumn('statuses', 'thumb', {
          type: Sequelize.STRING,
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
        queryInterface.removeColumn('statuses', 'images', {
          transaction
        }),

        queryInterface.removeColumn('statuses', 'thumb', {
          transaction
        }),
      ]);
    });
  }
};
