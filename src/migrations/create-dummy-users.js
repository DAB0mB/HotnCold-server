import 'dotenv/config';
import models from '../models';
import sequelize from '../sequelize';

const { User } = models;

async function createDummyUsers() {
  await sequelize.sync({ force: true }),

  await User.bulkCreate([
    {
      firstName: 'Eytan',
      lastName: 'Manor',
      gender: 'M',
      birthDate: '7/28/1994',
      occupation: 'Software Engineer',
      bio: "Love sports, computers, and into self development.",
      pictures: [],
    },
    {
      firstName: 'Laura',
      lastName: 'J Stinnett',
      gender: 'F',
      birthDate: '10/26/1993',
      occupation: 'Copy Writer',
      bio: "Amateur tv practitioner. Zombie fanatic. Infuriatingly humble twitter fan. Evil travelaholic.",
      pictures: [],
    },
    {
      firstName: 'Crystal',
      lastName: 'E Walker',
      gender: 'F',
      birthDate: '9/3/1991',
      occupation: 'Insurance Policy Processing Clerk',
      bio: "Social media expert. Devoted beer maven. Music ninja. Evil gamer. Award-winning analyst.",
      pictures: [],
    },
    {
      firstName: 'Dorothy',
      lastName: 'Funk',
      gender: 'F',
      birthDate: '7/25/1983',
      occupation: 'Demonstrator and Product Promoter',
      bio: "Evil coffee nerd. Analyst. Incurable bacon practitioner. Total twitter fan. Typical food aficionado.",
      pictures: [],
    },
    {
      firstName: 'Gary',
      lastName: 'Rodriguez',
      gender: 'M',
      birthDate: '6/2/1989',
      occupation: 'Social Science Research Assistant',
      bio: "Travel maven. Professional alcoholaholic. Infuriatingly humble music specialist. Gamer. Coffee ninja. General internet advocate.",
      pictures: [],
    },
    {
      firstName: 'Ken',
      lastName: 'Lea',
      gender: 'M',
      birthDate: '12/2/1991',
      occupation: 'Physical Therapist Assistant',
      bio: "Amateur social media fan. Professional bacon trailblazer. Hardcore explorer. Award-winning tv expert. Friendly pop culture maven.",
      pictures: [],
    },
  ]);

  process.exit(0);
}

createDummyUsers().catch((e) => {
  console.error(e);

  process.exit(1);
});
