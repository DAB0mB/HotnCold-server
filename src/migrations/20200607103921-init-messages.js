export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      chatId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      userId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      isTest: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      isMock: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('messages');
  }
};
