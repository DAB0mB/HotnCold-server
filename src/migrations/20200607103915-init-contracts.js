export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contracts', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      userId: {
        foreignKey: true,
        type: Sequelize.UUID,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      passcode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      passcodeExpiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      signed: {
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
    await queryInterface.dropTable('contracts');
  }
};
