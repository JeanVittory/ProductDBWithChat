import { readFile, writeFile } from 'fs/promises';
import { v4 as uuid } from 'uuid';
class Chat {
  #optionsTime = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  constructor(messagesFile) {
    this.chatDB = messagesFile;
  }

  async getAllMessage() {
    try {
      const responseJSON = JSON.parse(await readFile(this.chatDB, 'utf-8'));
      return responseJSON;
    } catch (error) {
      return error;
    }
  }
  async addMessage(message) {
    try {
      let arrayMessages = JSON.parse(await readFile(this.chatDB, 'utf-8'));
      message.id = uuid();
      message.date = new Date().toLocaleDateString('es', this.#optionsTime);
      arrayMessages = [...arrayMessages, message];
      await writeFile(
        this.chatDB,
        JSON.stringify(arrayMessages, null, 2),
        'utf-8'
      );
      return true;
    } catch (error) {
      return error;
    }
  }
}

export { Chat };
