import Sequelize from 'sequelize';

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV == 'production',
    },
  });
}
else {
  sequelize = new Sequelize(
    process.env.TEST_DATABASE || process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD || null,
    {
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV == 'production',
      },
    },
  );
}

export default sequelize;
