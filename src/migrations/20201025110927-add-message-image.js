export default {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.addColumn('messages', 'image', {
          type: Sequelize.STRING,
          allowNull: true,
        }, {
          transaction
        }),

        queryInterface.changeColumn('messages', 'text', {
          type: Sequelize.STRING,
          allowNull: true,
        }, {
          transaction
        }),
      ]);
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.removeColumn('messages', 'image', {
          transaction
        }),

        queryInterface.changeColumn('messages', 'text', {
          type: Sequelize.STRING,
          allowNull: false,
        }, {
          transaction
        }),
      ]);
    });
  }
};
