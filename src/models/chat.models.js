import { sqliteOpt } from '../config/knex.config.js';
import knex from 'knex';

const schemaChatMessage = async (db) => {
  try {
    const knexConnection = knex(sqliteOpt);
    await knexConnection.schema.createTable(db, (table) => {
      table.increments('id').notNullable;
      table.string('email').notNullable;
      table.string('message').notNullable;
      table.date('date').notNullable;
    });
    await knexConnection.destroy();
    return true;
  } catch (error) {
    return error;
  }
};
export { schemaChatMessage };
