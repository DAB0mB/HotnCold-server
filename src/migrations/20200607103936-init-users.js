export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      birthDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      occupation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notificationsToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bio: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pictures: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isMock: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
    await queryInterface.dropTable('users');
  }
};
