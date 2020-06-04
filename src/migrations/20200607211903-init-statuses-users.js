export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('statuses_users', {
      statusId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      userId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      isAuthor: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      isTest: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      isMock: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('statuses_users');
  }
};
