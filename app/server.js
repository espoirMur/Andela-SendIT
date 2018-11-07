import express from 'express';

const app = express();

app.get('/', (req, resp) => {
  resp.send('Hello From Express App');
});

const orders = require('../app/routes/orders').default;

app.use('/parcels', orders);
app.listen(process.env.PORT || 3000);

export default app;
