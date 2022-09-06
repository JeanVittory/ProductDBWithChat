import env from '../config/env.config.js';

const sqliteOpt = {
  client: 'sqlite3',
  connection: {
    filename: './src/databases/ecommerce.sqlite',
  },
  useNullAsDefault: true,
};

const databaseOpt = {
  client: 'mysql2',
  connection: {
    host: env.HOST_SQL,
    port: env.PORT_SQL,
    user: env.USER_SQL,
    password: env.PASSWORD_SQL,
    database: env.DATABASE_SQL,
  },
};

export { sqliteOpt, databaseOpt };
