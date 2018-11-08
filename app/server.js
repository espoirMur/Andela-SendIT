import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.get('/', (req, resp) => {
  resp.send('Hello From Express App');
});

const orders = require('../app/routes/orders').default;
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/parcels', orders);

app.listen(process.env.PORT || 3000);

export default app;
