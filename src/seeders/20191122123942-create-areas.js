'use strict';

const uuid = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await module.exports.down(queryInterface, Sequelize);

    return queryInterface.bulkInsert('areas', [
      {
        id: uuid(),
        name: 'Los Angeles, California, United States',
        shortName: 'Los Angeles',
        timezone: 'America/Los_Angeles',
        polygon: Sequelize.fn('ST_GeomFromText', 'POLYGON((-117.6687 34.8204, -117.6468 34.2892, -117.7289 34.0208, -117.7673 34.0263, -117.8056 33.9770, -117.7837 33.9441, -117.9754 33.9441, -117.9754 33.9003, -118.0575 33.8455, -118.1178 33.7415, -118.1835 33.7634, -118.1835 33.7196, -118.2602 33.7031, -118.4135 33.7415, -118.4300 33.7743, -118.3916 33.8401, -118.4628 33.9715, -118.5450 34.0372, -118.7476 34.0318, -118.8024 33.9989, -118.9448 34.0427, -118.9393 34.0756, -118.7860 34.1687, -118.6655 34.1687, -118.6655 34.2399, -118.6326 34.2399, -118.8846 34.7931, -118.8955 34.8204, -117.6687 34.8204))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(-118.2436 34.0522)'),
        phone: '+14157993599',
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'Taipei, Taiwan',
        shortName: 'Taipei',
        timezone: 'Asia/Taipei',
        polygon: Sequelize.fn('ST_GeomFromText', 'POLYGON((121.5108 25.0977, 121.5074 25.0957, 121.5010 25.0961, 121.4964 25.0929, 121.5048 25.0854, 121.5081 25.0753, 121.5069 25.0551, 121.5026 25.0470, 121.4878 25.0420, 121.4826 25.0350, 121.4873 25.0302, 121.4900 25.0230, 121.4897 25.0153, 121.4948 25.0106, 121.5032 25.0159, 121.5094 25.0215, 121.5165 25.0215, 121.5242 25.0129, 121.5316 25.0081, 121.5335 25.0044, 121.5305 25.0003, 121.5329 24.9932, 121.5553 24.9960, 121.5757 24.9952, 121.5865 25.0017, 121.5824 25.0153, 121.5762 25.0296, 121.5940 25.0364, 121.5959 25.0471, 121.5977 25.0506, 121.6068 25.0517, 121.6205 25.0540, 121.6222 25.0585, 121.6171 25.0630, 121.6133 25.0658, 121.6184 25.0744, 121.6157 25.0803, 121.5968 25.0852, 121.5874 25.0907, 121.5867 25.0985, 121.5795 25.1034, 121.5582 25.1025, 121.5465 25.1098, 121.5441 25.1188, 121.5262 25.1210, 121.5101 25.1188, 121.5060 25.1132, 121.5108 25.0977))'),
        center: Sequelize.fn('ST_GeomFromText', 'POINT(121.5654 25.0330)'),
        phone: '+14157993599',
        countryCode: '886',
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
