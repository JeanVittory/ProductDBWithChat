import { readFile, writeFile } from 'fs/promises';

class Contenedor {
  #optionsTime = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  #id = 1;
  constructor(nameDB) {
    this.db = nameDB;
  }

  async #AddNewData(data, optionsTime) {
    data.id = this.#id;
    await writeFile(this.db, JSON.stringify([data], null, 2), 'utf-8');
    return `El id del producto agregado el ${new Date().toLocaleDateString(
      'es',
      optionsTime
    )} es: ${data.id}`;
  }

  async save(data) {
    try {
      const response = await readFile(this.db, 'utf-8');
      if (!response) {
        return await this.#AddNewData(data, this.#optionsTime);
      }
      if (response) {
        const response = JSON.parse(await readFile(this.db, 'utf-8'));
        if (!response.length) {
          return await this.#AddNewData(data, this.#optionsTime);
        }
        const isRepeated = response.find(
          (item) => item.productName === data.productName
        );
        if (isRepeated) throw new Error('Producto ya agregado anteriormente');
        if (!isRepeated) {
          let response = JSON.parse(await readFile(this.db, 'utf-8'));
          data.id = response.at(-1).id + 1;
          response = [...response, data];
          await writeFile(this.db, JSON.stringify(response, null, 2), 'utf-8');
          return `El id del producto agregado el ${new Date().toLocaleDateString(
            'es',
            this.#optionsTime
          )} es: ${data.id}`;
        }
      }
    } catch (error) {
      return error;
    }
  }

  async getById(id) {
    try {
      if (id) {
        const response = await readFile(this.db, 'utf-8');
        if (!response) {
          throw new Error(
            'La base de datos se encuentra vacia dirijase a http://localhost:8080/formulario para agregar un producto'
          );
        }
      }
      const response = JSON.parse(await readFile(this.db, 'utf-8'));
      const isInDB = response.find((item) => item.id === id && item);
      if (!isInDB) throw new Error('El producto no existe en la base de datos');
      if (isInDB) return isInDB;
    } catch (error) {
      return error;
    }
  }

  async getByName(name) {
    try {
      if (name) {
        const response = await readFile(this.db, 'utf-8');
        if (!response) {
          throw new Error(
            'La base de datos se encuentra vacia dirijase a http://localhost:8080/formulario para agregar un producto'
          );
        }
      }
      const response = JSON.parse(await readFile(this.db, 'utf-8'));
      const isInDB = response.find((item) => item.productName === name && item);
      if (!isInDB) throw new Error('El producto no existe en la base de datos');
      if (isInDB) return isInDB;
    } catch (error) {
      return error;
    }
  }

  async getAll() {
    try {
      const responseString = await readFile(this.db, 'utf-8');
      if (!responseString) throw new Error('No hay productos agregados');
      if (responseString) {
        const response = JSON.parse(await readFile(this.db, 'utf-8'));
        return response;
      }
    } catch (error) {
      return error;
    }
  }

  async deleteById(id) {
    try {
      const responseString = await readFile(this.db, 'utf-8');
      if (!responseString) throw new Error('No hay productos agregados');
      const responseParse = JSON.parse(await readFile(this.db, 'utf-8'));
      if (responseParse.length === 0) {
        throw new Error(
          'No hay ningun elemento en la base de datos... primero agregue uno'
        );
      }
      const isInDB = responseParse.find((item) => item.id === id && item);
      if (!isInDB)
        throw new Error('El producto ingresado no existe en la base de datos');
      if (isInDB) {
        const DBFiltered = responseParse.filter((item) => item !== isInDB);
        await writeFile(this.db, JSON.stringify(DBFiltered, null, 2), 'utf-8');
        return { response: `El producto con el id ${id} fue eliminado` };
      }
    } catch (error) {
      return error;
    }
  }
  async updateById(id, productData) {
    try {
      const responseString = await readFile(this.db, 'utf-8');
      if (!responseString) throw new Error('No hay productos agregados');
      const responseParse = JSON.parse(await readFile(this.db, 'utf-8'));
      if (responseParse.length === 0) {
        throw new Error(
          'No hay ningun elemento en la base de datos... primero agregue uno'
        );
      }
      let isInDB = responseParse.find((item) => item.id === id && item);
      if (!isInDB)
        throw new Error('El producto ingresado no existe en la base de datos');
      if (isInDB) {
        isInDB = {
          productName: productData.productName || isInDB.productName,
          price: productData.price ? `$${productData.price}` : isInDB.price,
          thumbnail: productData.thumbnail || isInDB.thumbnail,
          id: id,
        };
        responseParse.splice(id - 1, 1, isInDB);
      }
      await writeFile(this.db, JSON.stringify(responseParse, null, 2), 'utf-8');
      return { response: `Producto con el id: ${id} actualizado` };
    } catch (error) {
      return error;
    }
  }
  async deleteAll() {
    try {
      const responseString = await readFile(this.db, 'utf-8');
      if (!responseString)
        throw new Error('La base de datos se encuentra vacia');
      const responseParse = JSON.parse(await readFile(this.db, 'utf-8'));
      if (!responseParse.length)
        throw new Error(
          'La base de datos se encuentra vacia, agregue un producto primero'
        );
      const newArray = responseParse.filter((item) => item !== item);
      await writeFile(this.db, JSON.stringify(newArray), 'utf-8');
    } catch (error) {
      console.log(error);
    }
  }
}

export { Contenedor };
