import express from 'express';
import bodyParser from 'body-parser';
import orders from './routes/orders';
import userOrdersRouter from './routes/user-orders';
import authRouter from './routes/authentification';
import {
  error5OOHandler,
  error4O4Handler,
  joiErrors,
} from './middlewares/errors';
import jsonReplacer from './utils/jsonReplacer';
import { ensureAuthentificated } from './middlewares/authentification';
import dotenv from 'dotenv';
import { sendEmail } from '../app/utils/sendEmails';
dotenv.config();

// read the virtual environement
const env = process.env.NODE_ENV;
// convert it to uppercasse
const envString = env.toUpperCase();
// get the correponding database URI
const DATABASEURI = process.env['PGDATABASE_' + envString];
// build the config object using the database URI and other env
const dbConfigObject = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: DATABASEURI,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};
const app = express();

app.get('/', async (req, resp) => {
  const mailOptions = {
    from: 'espoir.mur@gmail.com', // sender address
    to: 'espoir.mur@gmail.com', // list of receivers
    subject: 'test send email from andela', // Subject line
    html: '<p>test email</p>', // plain text body
    text: 'email is supposed to be sent',
  };
  await sendEmail(mailOptions)
    .then((info) => {
      console.log(info);
      resp.send({
        success: true,
        message:
          'welcome to my apis, check the documenation for more info on how to use',
      });
    })
    .catch((error) => {
      console.log(error);
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
app.use(ensureAuthentificated);
app.use('/api/v1/parcels', orders);
app.use('/api/v1/users', userOrdersRouter);

app.use(joiErrors());
app.use(error5OOHandler);
// for Page not found errors, all route not found should return this error
app.get('*', error4O4Handler);
app.listen(process.env.PORT || 3000);

export { app, dbConfigObject };
