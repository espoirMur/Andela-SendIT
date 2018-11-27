import { Pool } from 'pg';
import { dbConfigObject } from '../server';

const createDb = `
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name character varying(50) NOT NULL,
  passwordhash character varying(500) NOT NULL,
  email character varying(55) UNIQUE NOT NULL,
  registrationdate timestamp without time zone DEFAULT now(),
  phone character varying(50) NOT NULL,
  isadmin boolean NOT NULL
);


CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  origin character varying(50) NOT NULL,
  destination character varying(50) NOT NULL,
  presentlocation character varying(50),
  recipientphone character varying(35) NOT NULL,
  orderdate timestamp without time zone DEFAULT now(),
  deliverydate timestamp without time zone,
  comments character varying(350),
  status character varying(50) NOT NULL,
  initiatorid integer,
  weight integer,
  CONSTRAINT order_initiator_id_fk FOREIGN KEY (initiatorId)
     REFERENCES users (id) MATCH SIMPLE
     ON UPDATE NO ACTION ON DELETE NO ACTION
);
`;

const exitNode = () => {
  setTimeout(() => {
    process.exit(0); // Exit with success
  }, 900);
};

const createDatabase = async (query) => {
  const pool = new Pool(dbConfigObject);
  const client = await pool.connect();
  const result = await client.query(query);
  await client.end();
  return result;
};

createDatabase(createDb)
  .then((res) => {
    console.log(res);
    exitNode();
  })
  .catch((err) => {
    console.log(err);
    exitNode();
  });
