'use strict';

const uuid = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const [areas] = await queryInterface.sequelize.query('SELECT id, name FROM areas');

    if (!areas.length) {
      throw Error('Run "create-areas" seed first!');
    }

    await module.exports.down(queryInterface, Sequelize);

    return queryInterface.bulkInsert('users', [
      {
        id: uuid(),
        name: 'Patrick Star',
        // gender: 'M',
        birthDate: new Date('6/2/1989'),
        occupation: 'Social Science Research Assistant',
        bio: 'Travel maven. Professional alcoholaholic. Infuriatingly humble music specialist. Gamer. Coffee ninja. General internet advocate.',
        location: [34.77914, 32.072124],
        areaId: areas.find(a => a.name == 'HaMerkaz, Israel').id,
        pictures: [
          'https://i.imgur.com/I3ysYRt.png',
          'https://pbs.twimg.com/profile_images/588433110703865856/JgMKUdlE_400x400.jpg',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        isMock: true,
      },
      {
        id: uuid(),
        name: 'Laura Dern',
        // gender: 'F',
        birthDate: new Date('10/26/1993'),
        occupation: 'Copy Writer',
        bio: 'Amateur tv practitioner. Zombie fanatic. Infuriatingly humble twitter fan. Evil travelaholic.',
        location: [-73.984023, 40.725610],
        areaId: areas.find(a => a.name == 'Manhattan, New York, New York, United States').id,
        pictures: [
          'https://topicimages.mrowl.com/large/gracie/spongebobsquar/thecharacters/sandycheeks_1.jpg',
          'http://images6.fanpop.com/image/photos/36600000/Spongebob-Squarepants-image-spongebob-squarepants-36641840-512-512.jpg',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        isMock: true,
      },
      {
        id: uuid(),
        name: 'Crystal Reed',
        // gender: 'F',
        birthDate: new Date('9/3/1991'),
        occupation: 'Insurance Policy Processing Clerk',
        bio: 'Social media expert. Devoted beer maven. Music ninja. Evil gamer. Award-winning analyst.',
        location: [-122.480508, 37.757606],
        areaId: areas.find(a => a.name == 'San Francisco, California, United States').id,
        pictures: [
          'https://topicimages.mrowl.com/large/gracie/spongebobsquar/thecharacters/sandycheeks_1.jpg',
          'http://images6.fanpop.com/image/photos/36600000/Spongebob-Squarepants-image-spongebob-squarepants-36641840-512-512.jpg',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        isMock: true,
      },
      {
        id: uuid(),
        name: 'Dorothy Parker',
        // gender: 'F',
        birthDate: new Date('7/25/1983'),
        occupation: 'Demonstrator and Product Promoter',
        bio: 'Evil coffee nerd. Analyst. Incurable bacon practitioner. Total twitter fan. Typical food aficionado.',
        location: [127.011954, 37.563522],
        areaId: areas.find(a => a.name == 'Seoul, South Korea').id,
        pictures: [
          'https://topicimages.mrowl.com/large/gracie/spongebobsquar/thecharacters/sandycheeks_1.jpg',
          'http://images6.fanpop.com/image/photos/36600000/Spongebob-Squarepants-image-spongebob-squarepants-36641840-512-512.jpg',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        isMock: true,
      },
      {
        id: uuid(),
        name: 'Ken Miles',
        // gender: 'M',
        birthDate: new Date('12/2/1991'),
        occupation: 'Physical Therapist Assistant',
        bio: 'Amateur social media fan. Professional bacon trailblazer. Hardcore explorer. Award-winning tv expert. Friendly pop culture maven.',
        location: [-118.247318, 34.048535],
        areaId: areas.find(a => a.name == 'Los Angeles, California, United States').id,
        pictures: [
          'https://i.imgur.com/I3ysYRt.png',
          'https://pbs.twimg.com/profile_images/588433110703865856/JgMKUdlE_400x400.jpg',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        isMock: true,
      },
      {
        id: uuid(),
        name: 'Kate Connor',
        // gender: 'F',
        birthDate: new Date('10/6/1987'),
        occupation: 'Physical Therapist Assistant',
        bio: 'Evil coffee nerd. Analyst. Incurable bacon practitioner. Total twitter fan. Typical food aficionado.',
        location: [-121.883990, 37.332966],
        areaId: areas.find(a => a.name == 'San Jose, California, United States').id,
        pictures: [
          'https://topicimages.mrowl.com/large/gracie/spongebobsquar/thecharacters/sandycheeks_1.jpg',
          'http://images6.fanpop.com/image/photos/36600000/Spongebob-Squarepants-image-spongebob-squarepants-36641840-512-512.jpg',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        isMock: true,
      },
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('users', {
      isMock: true,
    });
  },
};
