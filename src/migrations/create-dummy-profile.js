import 'dotenv/config';
import models, { sequelize } from '../models';

const { User } = models;

async function createDummyProfile() {
  await sequelize.drop(),
  await sequelize.sync(),

  await User.create({
    firstName: 'Sponge',
    lastName: 'Bob',
    age: 22,
    job: 'cook',
    bio: "I'm ready! I'm ready! I'm ready! I'mmmmmm readddyyyyyy!!!",
    pictures: [
      'https://avatarfiles.alphacoders.com/152/152177.jpg',
      'https://mcdn.wallpapersafari.com/medium/66/23/SdlhJ8.jpg',
      'https://avatarfiles.alphacoders.com/833/83315.png',
    ],
  });

  process.exit(0);
}

createDummyProfile().catch((e) => {
  console.error(e);

  process.exit(1);
});
