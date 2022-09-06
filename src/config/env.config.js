import { config } from 'dotenv';
config();

export default {
  PORT: process.env.APP_PORT || 5000,
  PORT_SQL: process.env.APP_PORT_SQL || 3306,
  HOST_SQL: process.env.APP_HOST_SQL,
  USER_SQL: process.env.APP_USER_SQL,
  PASSWORD_SQL: process.env.APP_PASSWORD_SQL,
  DATABASE_SQL: process.env.APP_DATABASE_SQL,
};
