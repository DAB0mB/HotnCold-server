import uuid from 'uuid';

const mockData = {
  async up(queryInterface, Sequelize) {
    const [areas] = await queryInterface.sequelize.query('SELECT id, name, center FROM areas');

    if (!areas.length) {
      throw Error('Run "create-areas" seed first!');
    }

    await mockData.down(queryInterface, Sequelize);

    const locations = [];

    {
      const area = areas.find(a => a.name == 'Hong Kong');

      locations.push({
        coordinates: area.center.coordinates,
        areaId: area.id,
      });
    }

    {
      const area = areas.find(a => a.name == 'Los Angeles, California, United States');

      locations.push({
        coordinates: area.center.coordinates,
        areaId: area.id,
      });
    }

    {
      const area = areas.find(a => a.name == 'Taipei, Taiwan');

      locations.push({
        areaId: area.id,
        coordinates: area.center.coordinates,
      });
    }

    {
      const area = areas.find(a => a.name == 'Berlin, Germany');

      locations.push({
        areaId: area.id,
        coordinates: area.center.coordinates,
      });
    }

    {
      const area = areas.find(a => a.name == 'Tel Aviv-Yafo, Gush Dan, Israel');

      locations.push({
        coordinates: area.center.coordinates,
        areaId: area.id,
      });
    }

    {
      const area = areas.find(a => a.name == 'New York, New York, United States');

      locations.push({
        coordinates: area.center.coordinates,
        areaId: area.id,
      });
    }

    {
      const area = areas.find(a => a.name == 'San Francisco, California, United States');

      locations.push({
        coordinates: area.center.coordinates,
        areaId: area.id,
      });
    }

    {
      const area = areas.find(a => a.name == 'Portsmouth, New Hampshire, United States');

      locations.push({
        coordinates: area.center.coordinates,
        areaId: area.id,
      });
    }

    {
      const area = areas.find(a => a.name == 'Boston, Massachusetts, United States');

      locations.push({
        coordinates: area.center.coordinates,
        areaId: area.id,
      });
    }

    {
      const area = areas.find(a => a.name == 'Portland, Maine, United States');

      locations.push({
        coordinates: area.center.coordinates,
        areaId: area.id,
      });
    }

    {
      const area = areas.find(a => a.name == 'Sydney, New South Wales, Australia');

      locations.push({
        coordinates: area.center.coordinates,
        areaId: area.id,
      });
    }

    const chats = [];
    const users = [];
    const statuses = [];
    const chatsUsers = [];
    const statusUsers = [];

    locations.forEach(({ coordinates, areaId }) => {
      const chatId = uuid();
      const userId = uuid();
      const statusId = uuid();

      const base = {
        createdAt: new Date(),
        updatedAt: new Date(),
        isMock: true,
      };

      const chat = {
        id: chatId,
        isThread: true,
        isListed: true,
        bumpedAt: new Date(),
        ...base,
      };

      const user = {
        id: userId,
        name: 'Patrick Star',
        occupation: 'Unemployed',
        bio: 'Travel maven. Professional alcoholaholic. Infuriatingly humble music specialist. Gamer. Coffee ninja. General internet advocate.',
        birthDate: new Date('6 / 2 / 1989'),
        pictures: [
          'https://user-images.githubusercontent.com/7648874/83912636-df25d700-a776-11ea-94da-c64f9ea4ec98.png',
          'https://user-images.githubusercontent.com/7648874/83912688-f369d400-a776-11ea-908e-b66998f476e0.jpg',
        ],
        ...base,
      };

      const status = {
        id: statusId,
        published: true,
        isMeetup: false,
        areaId,
        chatId,
        text: 'Who wants to have a crabby patty?!',
        expiresAt: new Date(84 * (10 ** 14)),
        location: Sequelize.fn('ST_GeomFromText', `POINT(${coordinates.join(' ')})`),
        images: [
          'https://user-images.githubusercontent.com/7648874/95663761-79918f00-0b4a-11eb-896d-9e831f859dec.png'
        ],
        ...base,
      };

      const chatUser = {
        chatId,
        userId,
        ...base,
      };

      const statusUser = {
        statusId,
        userId,
        isAuthor: true,
        ...base,
      };

      chats.push(chat);
      users.push(user);
      statuses.push(status);
      chatsUsers.push(chatUser);
      statusUsers.push(statusUser);
    });

    await queryInterface.bulkInsert('chats', chats);
    await queryInterface.bulkInsert('users', users);
    await queryInterface.bulkInsert('statuses', statuses);
    await queryInterface.bulkInsert('chats_users', chatsUsers);
    await queryInterface.bulkInsert('statuses_users', statusUsers);
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
      await queryInterface.describeTable('chats');

      await queryInterface.bulkDelete('chats', {
        isMock: true,
      });
    }
    catch (e) {
      //First time migration
    }

    try {
      await queryInterface.describeTable('messages');

      await queryInterface.bulkDelete('messages', {
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

    try {
      await queryInterface.describeTable('chats_users');

      await queryInterface.bulkDelete('chats_users', {
        isMock: true,
      });
    }
    catch (e) {
      //First time migration
    }

    try {
      await queryInterface.describeTable('statuses_users');

      await queryInterface.bulkDelete('statuses_users', {
        isMock: true,
      });
    }
    catch (e) {
      //First time migration
    }
  },
};

export default mockData;
