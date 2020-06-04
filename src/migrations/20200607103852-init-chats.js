export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chats', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      isThread: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      isListed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      bumpedAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('chats');
  }
};
