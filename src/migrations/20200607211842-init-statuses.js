export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('statuses', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      areaId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      chatId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false,
      },
      expiresAt: {
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
    await queryInterface.dropTable('statuses');
  }
};
