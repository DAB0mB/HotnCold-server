export default {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn('contracts', 'referenceComment', {
          type: Sequelize.STRING,
          allowNull: true,
        }, {
          transaction
        }),

        queryInterface.addColumn('contracts', 'referenceSubmitted', {
          type: Sequelize.BOOLEAN,
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
        queryInterface.removeColumn('contracts', 'referenceComment', {
          transaction
        }),

        queryInterface.removeColumn('contracts', 'referenceSubmitted', {
          transaction
        }),
      ]);
    });
  }
};
