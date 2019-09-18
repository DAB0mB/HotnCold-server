import 'dotenv/config';

import * as mapbox from '../mapbox';
import models from '../models';
import sequelize from '../sequelize';

const { User } = models;

async function resetActiveUsersDataset() {
  const features = await mapbox.datasets.listFeatures({
    datasetId: process.env.ACTIVE_USERS_DATASET_ID
  }).send().then(res => res.body.features);

  const users = await User.findAll({
    attributes: ['id'],
  });

  await Promise.all(users.map(user =>
    mapbox.datasets.deleteFeature({
      datasetId: process.env.ACTIVE_USERS_DATASET_ID,
      featureId: `user_${user.id}`,
    }).send()
  ))
}

async function createDummyUsers() {
  await Promise.all([
    resetActiveUsersDataset(),
    sequelize.sync({ force: true }),
  ]);

  await User.bulkCreate([
    {
      firstName: 'Eytan',
      lastName: 'Manor',
      gender: 'M',
      birthDate: '7/28/1994',
      occupation: 'Software Engineer',
      bio: "Love sports, computers, and into self development.",
      location: [-73.984101, 40.725647],
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
      location: [-73.984023, 40.725610],
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
      location: [-73.983721, 40.726267],
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
      location: [-73.984566, 40.726633],
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
      location: [-73.983348, 40.725352],
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
      location: [-73.984448, 40.725141],
      pictures: [
        'https://i.imgur.com/I3ysYRt.png',
        'https://pbs.twimg.com/profile_images/588433110703865856/JgMKUdlE_400x400.jpg',
      ],
    },
  ]);

  const users = await User.findAll();

  await Promise.all(users.map((user) => (
    mapbox.datasets.putFeature({
      datasetId: process.env.ACTIVE_USERS_DATASET_ID,
      featureId: `user_${user.id}`,
      feature: {
        type: 'Feature',
        properties: user,
        geometry: {
          type: 'Point',
          coordinates: user.location,
        },
      },
    }).send()
  )));

  process.exit(0);
}

createDummyUsers().catch((e) => {
  console.error(e);

  process.exit(1);
});
