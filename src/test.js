import { sqliteOpt } from './config/knex.config.js';
import { databaseOpt } from './config/knex.config.js';
import { ChatServices } from './services/chat.services.js';
import { ProductsServices } from './services/products.services.js';

// ir borrando
import { Contenedor } from './class/container.class.js';
export const products = new Contenedor('./src/products.txt');

//new database
export const chatServices = new ChatServices(sqliteOpt, 'chatMessages');
export const productsServices = new ProductsServices(databaseOpt, 'products');
