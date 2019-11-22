'use strict';

const MOCK = '__MOCK__';

module.exports = {
  async up(queryInterface, sequelize) {
    const ny = await queryInterface.rawSelect('areas', {
      where: {
        name: 'Manhattan, New York, New York, United States',
      },
    }, ['id']);

    if (!ny) {
      throw Error('Run "create-areas" seed first!');
    }

    return queryInterface.bulkInsert('users', [
      {
        firstName: 'Eytan',
        lastName: MOCK,
        // gender: 'M',
        birthDate: new Date('7/28/1994'),
        occupation: 'Software Engineer',
        bio: "Love sports, computers, and into self development.",
        location: [-73.984101, 40.725647],
        areaId: ny.id,
        pictures: [
          'https://avatarfiles.alphacoders.com/833/83315.png',
          'https://a.ltrbxd.com/avatar/twitter/4/3/8/3/8/2/shard/http___pbs.twimg.com_profile_images_959679433505497089__0ShmWMC.jpg',
        ],
      },
      {
        firstName: 'Laura',
        lastName: MOCK,
        // gender: 'F',
        birthDate: new Date('10/26/1993'),
        occupation: 'Copy Writer',
        bio: "Amateur tv practitioner. Zombie fanatic. Infuriatingly humble twitter fan. Evil travelaholic.",
        location: [-73.984023, 40.725610],
        areaId: ny.id,
        pictures: [
          'https://topicimages.mrowl.com/large/gracie/spongebobsquar/thecharacters/sandycheeks_1.jpg',
          'http://images6.fanpop.com/image/photos/36600000/Spongebob-Squarepants-image-spongebob-squarepants-36641840-512-512.jpg',
        ],
      },
      {
        firstName: 'Crystal',
        lastName: MOCK,
        // gender: 'F',
        birthDate: new Date('9/3/1991'),
        occupation: 'Insurance Policy Processing Clerk',
        bio: "Social media expert. Devoted beer maven. Music ninja. Evil gamer. Award-winning analyst.",
        location: [-73.983721, 40.726267],
        areaId: ny.id,
        pictures: [
          'https://topicimages.mrowl.com/large/gracie/spongebobsquar/thecharacters/sandycheeks_1.jpg',
          'http://images6.fanpop.com/image/photos/36600000/Spongebob-Squarepants-image-spongebob-squarepants-36641840-512-512.jpg',
        ],
      },
      {
        firstName: 'Dorothy',
        lastName: MOCK,
        // gender: 'F',
        birthDate: new Date('7/25/1983'),
        occupation: 'Demonstrator and Product Promoter',
        bio: "Evil coffee nerd. Analyst. Incurable bacon practitioner. Total twitter fan. Typical food aficionado.",
        location: [-73.984566, 40.726633],
        areaId: ny.id,
        pictures: [
          'https://topicimages.mrowl.com/large/gracie/spongebobsquar/thecharacters/sandycheeks_1.jpg',
          'http://images6.fanpop.com/image/photos/36600000/Spongebob-Squarepants-image-spongebob-squarepants-36641840-512-512.jpg',
        ],
      },
      {
        firstName: 'Gary',
        lastName: MOCK,
        // gender: 'M',
        birthDate: new Date('6/2/1989'),
        occupation: 'Social Science Research Assistant',
        bio: "Travel maven. Professional alcoholaholic. Infuriatingly humble music specialist. Gamer. Coffee ninja. General internet advocate.",
        location: [-73.983348, 40.725352],
        areaId: ny.id,
        pictures: [
          'https://i.imgur.com/I3ysYRt.png',
          'https://pbs.twimg.com/profile_images/588433110703865856/JgMKUdlE_400x400.jpg',
        ],
      },
      {
        firstName: 'Ken',
        lastName: MOCK,
        // gender: 'M',
        birthDate: new Date('12/2/1991'),
        occupation: 'Physical Therapist Assistant',
        bio: "Amateur social media fan. Professional bacon trailblazer. Hardcore explorer. Award-winning tv expert. Friendly pop culture maven.",
        location: [-73.984448, 40.725141],
        areaId: ny.id,
        pictures: [
          'https://i.imgur.com/I3ysYRt.png',
          'https://pbs.twimg.com/profile_images/588433110703865856/JgMKUdlE_400x400.jpg',
        ],
      },
    ]);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', {
      lastName: MOCK,
    });
  },
};
