'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'birthDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'occupation', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'bio', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'pictures', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'birthDate', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn('users', 'occupation', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('users', 'bio', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('users', 'pictures', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    });
  }
};
