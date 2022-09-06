import { schemaChatMessage } from '../models/chat.models.js';
import knex from 'knex';

export class ChatServices {
  #db;
  #optKnex;
  #optionsTime = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  constructor(knexConnectionOpt, dbName) {
    this.#optKnex = knexConnectionOpt;
    this.#db = dbName;
  }
  async addMessage(message) {
    try {
      console.log(this.#optKnex);
      const knexConnection = knex(this.#optKnex);
      const existTable = await knexConnection.schema.hasTable(this.#db);
      message.date = new Date().toLocaleDateString('es', this.#optionsTime);
      if (!existTable) {
        const isCreated = await schemaChatMessage(this.#db);
        isCreated && (await knexConnection(this.#db).insert(message));
        const data = await knexConnection.select('*').from(this.#db);
        console.log(data);
        await knexConnection.destroy();
        return true;
      }
      await knexConnection(this.#db).insert(message);
      const data = await knexConnection.select('*').from(this.#db);
      console.log(data);
      knexConnection.destroy();
      return true;
    } catch (error) {
      return error;
    }
  }

  async getAllMessages() {
    try {
      const knexConnection = knex(this.#optKnex);
      const existTable = await knexConnection.schema.hasTable(this.#db);
      if (!existTable) {
        await schemaChatMessage(this.#db);
        await knexConnection.destroy();
        return [];
      }
      const allMessagesFromDB = await knexConnection.select('*').from(this.#db);
      await knexConnection.destroy();
      return allMessagesFromDB;
    } catch (error) {
      return error;
    }
  }
}
