import express from 'express';
import bodyParser from 'body-parser';
import orders from './routes/orders';
import userOrdersRouter from './routes/user-orders';

const app = express();

app.get('/', (req, resp) => {
  resp.send('Hello From Express App');
});

// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/parcels', orders);
app.use('/api/v1/users', userOrdersRouter);
app.listen(process.env.PORT || 3000);

export default app;
