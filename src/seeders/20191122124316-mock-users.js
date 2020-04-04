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
        coordinates: [-118.247318, 34.048535],
        areaId: areas.find(a => a.name == 'Los Angeles, California, United States').id,
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
