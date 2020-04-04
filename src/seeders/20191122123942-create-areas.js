'use strict';

const uuid = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await module.exports.down(queryInterface, Sequelize);

    return queryInterface.bulkInsert('areas', [
      {
        id: uuid(),
        name: 'Los Angeles, California, United States',
        polygon: Sequelize.fn('ST_GeomFromText', 'POLYGON((-117.6687 34.8204, -117.6468 34.2892, -117.7289 34.0208, -117.7673 34.0263, -117.8056 33.9770, -117.7837 33.9441, -117.9754 33.9441, -117.9754 33.9003, -118.0575 33.8455, -118.1178 33.7415, -118.1835 33.7634, -118.1835 33.7196, -118.2602 33.7031, -118.4135 33.7415, -118.4300 33.7743, -118.3916 33.8401, -118.4628 33.9715, -118.5450 34.0372, -118.7476 34.0318, -118.8024 33.9989, -118.9448 34.0427, -118.9393 34.0756, -118.7860 34.1687, -118.6655 34.1687, -118.6655 34.2399, -118.6326 34.2399, -118.8846 34.7931, -118.8955 34.8204, -117.6687 34.8204))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(-118.243683 34.052235)'),
        phone: '+14157993599',
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    try {
      await queryInterface.describeTable('areas');
    }
    catch (e) {
      //First time migration
      return;
    }

    return queryInterface.bulkDelete('areas', null);
  },
};
