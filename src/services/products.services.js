import knex from 'knex';
import { schemaProducts } from '../models/products.models.js';

class ProductsServices {
  #db;
  #optionsDB;
  constructor(optionsDB, db) {
    this.#db = db;
    this.#optionsDB = optionsDB;
  }

  async saveProduct(product) {
    try {
      const knexConnection = knex(this.#optionsDB);
      const responseFromDb = await knexConnection(this.#db).insert(product);
      await knexConnection.destroy();
      const responseToController = { status: 'ok', id: responseFromDb.join() };
      return responseToController;
    } catch (error) {
      return error;
    }
  }

  async getAllProducts() {
    try {
      const knexConnection = knex(this.#optionsDB);
      const existTable = await knexConnection.schema.hasTable(this.#db);
      if (!existTable) {
        await schemaProducts(this.#db);
        await knexConnection.destroy();
        return [];
      }
      const products = await knexConnection.select('*').from(this.#db);
      await knexConnection.destroy();
      return products;
    } catch (error) {
      return error;
    }
  }

  async getById(idProduct) {
    try {
      const knexConnection = knex(this.#db);
      const productFromDb = await knexConnection
        .select('*')
        .from(this.#db)
        .where({ id: idProduct });
      knexConnection.destroy();
      return productFromDb;
    } catch (error) {
      return error;
    }
  }

  async getByName(name) {
    try {
      const knexConnection = knex(this.#optionsDB);
      const product = await knexConnection
        .select('*')
        .from(this.#db)
        .where({ productName: name });
      knexConnection.destroy();
      return product;
    } catch (error) {
      return error;
    }
  }

  async deleteById(idproduct) {
    try {
      const knexConnection = knex(this.#optionsDB);
      await knexConnection(this.#db).where({ id: idproduct }).del();
      await knexConnection.destroy();
    } catch (error) {
      return error;
    }
  }

  async updateById(idProduct, dataToUpdate) {
    try {
      const knexConnection = knex(this.#optionsDB);
      if (dataToUpdate) {
        const arrayFilteredDataProduct = Object.entries(dataToUpdate).filter(
          ([key, value]) => value !== null
        );
        const dataProductToUpdate = Object.fromEntries(
          arrayFilteredDataProduct
        );
        await knexConnection(this.#db)
          .where({ id: idProduct })
          .update(dataProductToUpdate);
      }
      await knexConnection.destroy();
    } catch (error) {
      return error;
    }
  }
}

export { ProductsServices };
