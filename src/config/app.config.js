import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { engine } from 'express-handlebars';
import env from './env.config.js';
import { routerProducts } from '../routes/products.routes.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', express.static(path.join(__dirname, '../public')));
app.use('/api/v1', routerProducts);
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');
app.set('port', env.PORT);

export { app };
