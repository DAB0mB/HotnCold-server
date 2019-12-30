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
        phone: '+17653284774', // TODO: Generate twilio number
        countryCode: '972',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'Manhattan, New York, New York, United States',
        geoFeaturesIds: ['locality.12696928000137850'],
        phone: '+17653284774', // TODO: Generate twilio number
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'San Francisco, California, United States',
        geoFeaturesIds: ['place.15734669613361910'],
        phone: '+17653284774', // TODO: Generate twilio number
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'San Jose, California, United States',
        geoFeaturesIds: ['place.7704339974165690'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'Seoul, South Korea',
        geoFeaturesIds: ['place.15016829751699340'],
        phone: '+17653284774', // TODO: Generate twilio number
        countryCode: '82',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'Los Angeles, California, United States',
        geoFeaturesIds: ['region.11319063928738010'],
        phone: '+17653284774', // TODO: Generate twilio number
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('areas', null);
  },
};
