import { Router } from 'express';
import { multerMiddleware } from '../tools/multer.tools.js';
import {
  getProducts,
  getProductsById,
  postProducts,
  putProductsById,
  deleteProductsById,
} from '../controllers/products.controllers.js';

const routerProducts = Router();

routerProducts.get('/productos', getProducts);
routerProducts.get('/productos/:id', getProductsById);
routerProducts.post('/productos', multerMiddleware, postProducts);
routerProducts.put('/productos/:id', multerMiddleware, putProductsById);
routerProducts.delete('/productos/:id', deleteProductsById);

export { routerProducts };
