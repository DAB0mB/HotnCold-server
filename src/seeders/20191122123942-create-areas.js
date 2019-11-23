'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('areas', [
      {
        name: 'HaMerkaz, Israel',
        geoFeaturesIds: ['region.8593132391633450', 'region.12549636937738800'],
      },
      {
        name: 'Manhattan, New York, New York, United States',
        geoFeaturesIds: ['locality.12696928000137850'],
      },
      {
        name: 'San Francisco, California, United States',
        geoFeaturesIds: ['place.15734669613361910'],
      },
      {
        name: 'Seoul, South Korea',
        geoFeaturesIds: ['place.15016829751699340'],
      },
      {
        name: 'Los Angeles, California, United States',
        geoFeaturesIds: ['region.11319063928738010'],
      },
    ]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('areas', null);
  },
};
