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
import authRouter from './routes/authentication';
import {
  error5OOHandler,
  error4O4Handler,
  joiErrors,
} from './middlewares/errors';
import jsonReplacer from './utils/jsonReplacer';
import { ensureAuthenticated } from './middlewares/authentication';

dotenv.config();

const app = express();

app.get('/', (req, resp) => {
  resp.send({
    success: true,
    message:
      "Welcome to my apis, check the documenation <a href='https://documenter.getpostman.com/view/2725783/RzfcNXj2'>Here</a>",
  });
});

// allow apis to consume my applciation
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
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

// for Page not found errors, all route not found should return this error

app.use(error5OOHandler);
app.get('*', error4O4Handler);
app.listen(process.env.PORT || 3000);

// eslint-disable-next-line import/prefer-default-export
export { app };
