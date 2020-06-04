export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('areas', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shortName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      countryCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timezone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      polygon: {
        allowNull: false,
        type: Sequelize.GEOMETRY('MULTIPOLYGON'),
      },
      center: {
        type: Sequelize.GEOMETRY('POINT'),
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
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('areas');
  }
};
