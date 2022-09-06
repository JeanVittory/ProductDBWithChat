import { sqliteOpt } from './config/knex.config.js';
import { databaseOpt } from './config/knex.config.js';
import { ChatServices } from './services/chat.services.js';
import { ProductsServices } from './services/products.services.js';

export const chatServices = new ChatServices(sqliteOpt, 'chatMessages');
export const productsServices = new ProductsServices(databaseOpt, 'products');
