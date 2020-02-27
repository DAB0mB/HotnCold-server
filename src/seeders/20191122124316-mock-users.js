'use strict';

const uuid = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const [areas] = await queryInterface.sequelize.query('SELECT id, name FROM areas');

    if (!areas.length) {
      throw Error('Run "create-areas" seed first!');
    }

    await module.exports.down(queryInterface, Sequelize);

    const locations = [
      {
        coordinates: [34.77914, 32.072124],
        areaId: areas.find(a => a.name == 'HaMerkaz, Israel').id,
      },
      {
        coordinates: [-73.984023, 40.725610],
        areaId: areas.find(a => a.name == 'Manhattan, New York, New York, United States').id,
      },
      {
        coordinates: [-122.480508, 37.757606],
        areaId: areas.find(a => a.name == 'San Francisco, California, United States').id,
      },
      {
        coordinates: [127.011954, 37.563522],
        areaId: areas.find(a => a.name == 'Seoul, South Korea').id,
      },
      {
        coordinates: [-118.247318, 34.048535],
        areaId: areas.find(a => a.name == 'Los Angeles, California, United States').id,
      },
      {
        coordinates: [-121.883990, 37.332966],
        areaId: areas.find(a => a.name == 'San Jose, California, United States').id,
      },
      {
        coordinates: [-118.493932,34.0136537],
        areaId: areas.find(a => a.name == 'Santa Monica, California, United States').id,
      },
    ];

    const statuses = [];
    const users = [];

    locations.forEach(({ coordinates, areaId }) => {
      const statusId = uuid();
      const userId = uuid();

      const base = {
        isMock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        location: Sequelize.fn('ST_GeomFromText', `POINT(${coordinates.join(' ')})`),
        locationExpiresAt: new Date('1 / 1 / 3000'),
        areaId,
      };

      const status = {
        id: statusId,
        text: 'Who wants to have a crabby patty?!',
        ...base,
      };

      const user = {
        id: userId,
        statusId,
        discoverable: true,
        name: 'Patrick Star',
        birthDate: new Date('6/2/1989'),
        occupation: 'Unemployed',
        bio: 'Travel maven. Professional alcoholaholic. Infuriatingly humble music specialist. Gamer. Coffee ninja. General internet advocate.',
        pictures: [
          'https://i.imgur.com/I3ysYRt.png',
          'https://pbs.twimg.com/profile_images/588433110703865856/JgMKUdlE_400x400.jpg',
        ],
        ...base,
      };

      statuses.push(status);
      users.push(user);
    });

    await queryInterface.bulkInsert('statuses', statuses);
    await queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface) {
    try {
      await queryInterface.describeTable('users');

      await queryInterface.bulkDelete('users', {
        isMock: true,
      });
    }
    catch (e) {
      //First time migration
    }

    try {
      await queryInterface.describeTable('statuses');

      await queryInterface.bulkDelete('statuses', {
        isMock: true,
      });
    }
    catch (e) {
      //First time migration
    }
  },
};
