export default {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn('contracts', 'email', {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true,
        }, {
          transaction
        }),

        queryInterface.addColumn('contracts', 'referenceComment', {
          type: Sequelize.ARRAY(Sequelize.STRING),
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
        queryInterface.removeColumn('contracts', 'email', {
          transaction
        }),

        queryInterface.removeColumn('contracts', 'referenceComment', {
          transaction
        }),
      ]);
    });
  }
};
