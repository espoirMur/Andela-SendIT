/* eslint-disable import/no-cycle */
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import orderRouter from './routes/orders/orders';
import cancelRoute from './routes/orders/order-cancel';
import destinationRouter from './routes/orders/order-change-destination';
import locationRouter from './routes/orders/order-change-location';
import statusRouter from './routes/orders/order-change-status';
import userOrdersRouter from './routes/user-orders';
import authRouter from './routes/authentification';
import {
  error5OOHandler,
  error4O4Handler,
  joiErrors,
} from './middlewares/errors';
import jsonReplacer from './utils/jsonReplacer';
import { ensureAuthenticated } from './middlewares/authentification';

dotenv.config();

// read the virtual environement
const env = process.env.NODE_ENV;

// get the correponding database URI
const DATABASEURI = process.env[`PGDATABASE_${env}`];
// build the config object using the database URI and other env
const dbConfigObject = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: DATABASEURI,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};
const app = express();

app.get('/', (req, resp) => {
  resp.send({
    success: true,
    message:
      'Welcome to my apis, check the documenation for more info on how to use',
  });
});

app.get('/test/errors/', (req, resp, error) => {
  throw new Error('A new error');
});

// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('json replacer', jsonReplacer);
app.use('/auth', authRouter);
app.use(ensureAuthenticated);
app.use('/api/v1/parcels', [
  orderRouter,
  cancelRoute,
  destinationRouter,
  locationRouter,
  statusRouter,
]);
app.use('/api/v1/users', userOrdersRouter);

app.use(joiErrors());
app.use(error5OOHandler);
// for Page not found errors, all route not found should return this error
app.get('*', error4O4Handler);
app.listen(process.env.PORT || 3000);

export { app, dbConfigObject };
