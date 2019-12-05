'use strict';

const uuid = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await module.exports.down(queryInterface, Sequelize);

    return queryInterface.bulkInsert('areas', [
      {
        id: uuid(),
        name: 'HaMerkaz, Israel',
        geoFeaturesIds: ['region.8593132391633450', 'region.12549636937738800'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'Manhattan, New York, New York, United States',
        geoFeaturesIds: ['locality.12696928000137850'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'San Francisco, California, United States',
        geoFeaturesIds: ['place.15734669613361910'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'Seoul, South Korea',
        geoFeaturesIds: ['place.15016829751699340'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'Los Angeles, California, United States',
        geoFeaturesIds: ['region.11319063928738010'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('areas', null);
  },
};
