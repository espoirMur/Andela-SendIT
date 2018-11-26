
CREATE TABLE users (
    id serial PRIMARY KEY,
    name character varying(50) NOT NULL,
    passwordhash character varying(500) NOT NULL,
    email character varying(55) UNIQUE NOT NULL,
    registrationdate timestamp without time zone DEFAULT now(),
    phone character varying(50) NOT NULL,
    isadmin boolean NOT NULL
);


CREATE TABLE orders (
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
    weight integer
);

CONSTRAINT order_initiator_id_fk FOREIGN KEY (initiatorId)
       REFERENCES users (id) MATCH SIMPLE
       ON UPDATE NO ACTION ON DELETE NO ACTION
 );