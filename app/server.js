import express from 'express';
import bodyParser from 'body-parser';
import orders from './routes/orders';
import userOrdersRouter from './routes/user-orders';
import { error5OOHandler, error4O4Handler } from './middlewares/errors';

const app = express();

app.get('/', (req, resp) => {
  resp.send({
    success: true,
    message: 'welcome to my apis, check the documenation for more info on how to use',
  });
});

app.get('/test/errors/', (req, resp, error) => {
  throw new Error('A new error');
});

// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/parcels', orders);
app.use('/api/v1/users', userOrdersRouter);
app.use(error5OOHandler);
// for Page not found errors, all route not found should return this error
app.get('*', error4O4Handler);
app.listen(process.env.PORT || 3000);

export default app;
