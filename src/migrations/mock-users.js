import 'dotenv/config';

import models from '../models';
import sequelize from '../sequelize';
import syncAreas from './sync-areas';

const { User } = models;

async function mockUsers() {
  await Promise.all([
    await syncAreas(),
    await User.sync({ force: true }),
  ]);

  await User.bulkCreate([
    {
      firstName: 'Eytan',
      lastName: 'Manor',
      gender: 'M',
      birthDate: '7/28/1994',
      occupation: 'Software Engineer',
      bio: "Love sports, computers, and into self development.",
      pictures: [
        'https://avatarfiles.alphacoders.com/833/83315.png',
        'https://a.ltrbxd.com/avatar/twitter/4/3/8/3/8/2/shard/http___pbs.twimg.com_profile_images_959679433505497089__0ShmWMC.jpg',
      ],
    },
    {
      firstName: 'Laura',
      lastName: 'J Stinnett',
      gender: 'F',
      birthDate: '10/26/1993',
      occupation: 'Copy Writer',
      bio: "Amateur tv practitioner. Zombie fanatic. Infuriatingly humble twitter fan. Evil travelaholic.",
      pictures: [
        'https://topicimages.mrowl.com/large/gracie/spongebobsquar/thecharacters/sandycheeks_1.jpg',
        'http://images6.fanpop.com/image/photos/36600000/Spongebob-Squarepants-image-spongebob-squarepants-36641840-512-512.jpg',
      ],
    },
    {
      firstName: 'Crystal',
      lastName: 'E Walker',
      gender: 'F',
      birthDate: '9/3/1991',
      occupation: 'Insurance Policy Processing Clerk',
      bio: "Social media expert. Devoted beer maven. Music ninja. Evil gamer. Award-winning analyst.",
      pictures: [
        'https://topicimages.mrowl.com/large/gracie/spongebobsquar/thecharacters/sandycheeks_1.jpg',
        'http://images6.fanpop.com/image/photos/36600000/Spongebob-Squarepants-image-spongebob-squarepants-36641840-512-512.jpg',
      ],
    },
    {
      firstName: 'Dorothy',
      lastName: 'Funk',
      gender: 'F',
      birthDate: '7/25/1983',
      occupation: 'Demonstrator and Product Promoter',
      bio: "Evil coffee nerd. Analyst. Incurable bacon practitioner. Total twitter fan. Typical food aficionado.",
      pictures: [
        'https://topicimages.mrowl.com/large/gracie/spongebobsquar/thecharacters/sandycheeks_1.jpg',
        'http://images6.fanpop.com/image/photos/36600000/Spongebob-Squarepants-image-spongebob-squarepants-36641840-512-512.jpg',
      ],
    },
    {
      firstName: 'Gary',
      lastName: 'Rodriguez',
      gender: 'M',
      birthDate: '6/2/1989',
      occupation: 'Social Science Research Assistant',
      bio: "Travel maven. Professional alcoholaholic. Infuriatingly humble music specialist. Gamer. Coffee ninja. General internet advocate.",
      pictures: [
        'https://i.imgur.com/I3ysYRt.png',
        'https://pbs.twimg.com/profile_images/588433110703865856/JgMKUdlE_400x400.jpg',
      ],
    },
    {
      firstName: 'Ken',
      lastName: 'Lea',
      gender: 'M',
      birthDate: '12/2/1991',
      occupation: 'Physical Therapist Assistant',
      bio: "Amateur social media fan. Professional bacon trailblazer. Hardcore explorer. Award-winning tv expert. Friendly pop culture maven.",
      pictures: [
        'https://i.imgur.com/I3ysYRt.png',
        'https://pbs.twimg.com/profile_images/588433110703865856/JgMKUdlE_400x400.jpg',
      ],
    },
  ]);

  const users = await User.findAll();

  await Promise.all([
    users[0].setLocation([-73.984101, 40.725647]),
    users[1].setLocation([-73.984023, 40.725610]),
    users[2].setLocation([-73.983721, 40.726267]),
    users[3].setLocation([-73.984566, 40.726633]),
    users[4].setLocation([-73.983348, 40.725352]),
    users[5].setLocation([-73.984448, 40.725141]),
  ]);
}

if (require.main === module) {
  mockUsers()
    .then(() => {
      console.log('Successfully created dummy users!');

      process.exit(0);
    })
    .catch((e) => {
      console.error(e);

      process.exit(1);
    });
}
