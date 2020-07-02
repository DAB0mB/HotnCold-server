export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chats_subscriptions', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      userId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      chatId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      isTest: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      isActive: {
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
    await queryInterface.dropTable('chats_subscriptions');
  }
};
