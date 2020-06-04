export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chats_users', {
      userId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      chatId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      unreadMessagesIds: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      },
      isMock: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      isTest: {
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
    await queryInterface.dropTable('chats_users');
  }
};
