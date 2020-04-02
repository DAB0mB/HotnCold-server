'use strict';

const uuid = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await module.exports.down(queryInterface, Sequelize);

    // TODO: Use names only, not IDs, since they're subject to change by Mapbox
    return queryInterface.bulkInsert('areas', [
      {
        id: uuid(),
        name: 'HaMerkaz, Israel',
        geoFeaturesIds: ['place.6158663202435630', 'region.9798269880738800'],
        phone: '+14157993599',
        countryCode: '972',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'Manhattan, New York, New York, United States',
        geoFeaturesIds: ['locality.12696928000137850'],
        phone: '+14157993599',
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'San Francisco, California, United States',
        geoFeaturesIds: ['place.15734669613559250'],
        phone: '+14157993599',
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'San Jose, California, United States',
        geoFeaturesIds: ['place.7704339974165690'],
        phone: '+14157993599',
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'Seoul, South Korea',
        geoFeaturesIds: ['place.10069031024699340'],
        phone: '+14157993599',
        countryCode: '82',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'Los Angeles, California, United States',
        geoFeaturesIds: ['place.7397503093427640'],
        phone: '+14157993599',
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: 'Santa Monica, California, United States',
        geoFeaturesIds: ['place.2189318093804030'],
        phone: '+14157993599',
        countryCode: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
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
