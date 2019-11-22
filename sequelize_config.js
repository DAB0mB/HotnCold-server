require('dotenv/config');

module.exports = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV == 'production',
  },
};
