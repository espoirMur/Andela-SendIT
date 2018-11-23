import { Pool, Client } from 'pg';

const pool = new Pool();

const connectToDb = async () => {
  let client;
  try {
    client = await pool.connect();
    const initialquery = client.query();
    initialquery.on('end', () => {
      client.end();
      console.log('done');
    });
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
};

const createDb = `
CREATE TABLE users(
  id serial PRIMARY KEY,
  name VARCHAR (50) NOT NULL,
  passwordHash VARCHAR (500) NOT NULL,
  email VARCHAR (55) UNIQUE NOT NULL,
  registrationDate TIMESTAMP DEFAULT NOW(),
  phone VARCHAR (50) NOT NULL,
  isAdmin boolean not NULL
 );

 CREATE TABLE orders(
  id serial PRIMARY KEY,
  origin VARCHAR (50) NOT NULL,
  destination VARCHAR (50) NOT NULL,
  presentLocation VARCHAR (50) ,
  recipentPhone VARCHAR (35) NOT NULL,
  orderDate TIMESTAMP DEFAULT NOW(),
  deliveryDate TIMESTAMP,
  commnent VARCHAR (350) ,
  status VARCHAR(50) NOT NULL,
  initiatorId INTEGER,
  weight INTEGER,
  CONSTRAINT order_initiator_id_fk FOREIGN KEY (initiatorId)
       REFERENCES users (id) MATCH SIMPLE
       ON UPDATE NO ACTION ON DELETE NO ACTION
 );
`;

const createDatabase = async () => {
  const pool = await new Pool();
  pool.query(createDb, (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log(res);
      return res;
    }
  });
};

export { connectToDb, pool, createDatabase };
