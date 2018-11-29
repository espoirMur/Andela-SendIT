import dotenv from 'dotenv';
import url from 'url';

dotenv.config();

// read the virtual environement
const env = process.env.NODE_ENV;
let dbConfigObject;

if (env === 'production') {
  // check if we are in heroku config
  /** The Pool constructor does not support passing a Database URL as the parameter.
   *  To use pg-pool on heroku, for example, you need to parse the URL into a config object.
   * https://www.npmjs.com/package/pg-pool for heroku config */

  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');
  dbConfigObject = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true,
  };
} else {
  // get the correponding database URI
  const DATABASEURI = process.env[`PGDATABASE_${env}`];
  // build the config object using the database URI and other env
  dbConfigObject = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: DATABASEURI,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  };
}
export default dbConfigObject;
