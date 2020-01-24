/* eslint-disable comma-dangle */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Order } from '../app/models/orders';
import { token } from './test-initial';
import { queryGetAll, queryGetId } from '../app/models/orderQueries';

import { app } from '../app/server';

/** setting up the test server */
chai.use(chaiHttp);
const { should } = chai.should();
const { expect } = chai.expect;
let orderId;
const returnAllOrders = (done) => {
  /**
   * test if We  can return all orders in json format
   */

  Order.queryDb(queryGetAll)
    .then((results) => {
      chai
        .request(app)
        .get('/api/v1/parcels')
        .set('authorization', `Beared ${token}`)
        .end((error, response) => {
          response.should.have.status(200);
          response.type.should.be.eql('application/json');
          response.body.should.be.eql(results.rows);
          done();
        });
    })
    .catch((error) => {
      done(error);
    });
};

const cannotCreateOrderOrigin = (done) => {
  /**
   * cannot create an order if  pick-up location is missing
   *  */
  const order = {
    origin: '',
    destination: 'Kamembe',
    recipientPhone: '0781234567',
    comments: 'call the recipient on reception',
  };

  chai
    .request(app)
    .post('/api/v1/parcels')
    .send(order)
    .set('authorization', `Beared ${token}`)
    .type('application/json')
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('Pickup location is required');
      done();
    });
};

const cannotCreateOrderDestination = (done) => {
  /**
   * cannot create an order if  destination is missing
   *  */
  const order = {
    origin: 'espoir',
    destination: '',
    recipientPhone: '0781234567',
    comments: 'call the recipient on reception',
  };

  chai
    .request(app)
    .post('/api/v1/parcels')
    .send(order)
    .set('authorization', `Beared ${token}`)
    .type('application/json')
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('Destination is required');
      done();
    });
};

const cannotCreateOrderRecipientPhone = (done) => {
  /**
   * cannot create an order if  recipient phone missing
   *  */
  const order = {
    origin: 'kigali',
    destination: 'Kamembe',
    recipientPhone: '123',
    comments: 'call the recipient on reception',
  };

  chai
    .request(app)
    .post('/api/v1/parcels')
    .send(order)
    .set('authorization', `Beared ${token}`)
    .type('application/json')
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql(
          'Please enter a valid phone number , staring with 078, 072 or 073',
        );
      done();
    });
};

const cannotCreateOrderBadContent = (done) => {
  /**
   * should return 406 if  the content type is not json
   *  */
  const order = {
    origin: 'test',
    destination: 'Kamembe',
    recipientPhone: '0781234567',
    comments: 'call the recipient on reception',
  };

  chai
    .request(app)
    .post('/api/v1/parcels')
    .send(order)
    .set('authorization', `Beared ${token}`)
    .type('form')
    .end((request, response) => {
      response.should.have.status(406);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have.property('message').eql('Invalid content type');
      done();
    });
};

const canGetOrderById = (done) => {
  /**
   * test if we can get a delivery order by id
   *
   */
  const values = [orderId];
  Order.queryDb(queryGetId, values)
    .then((results) => {
      const order = results.rows[0];
      chai
        .request(app)
        .get(`/api/v1/parcels/${orderId}`)
        .set('authorization', `Beared ${token}`)
        .end((request, response) => {
          const receivedOrder = response.body.order;
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('success').eql(true);
          response.body.should.have
            .property('message')
            .eql('Delivery order  retrieved successfully');
          receivedOrder.origin.should.be.eql(order.origin);
          receivedOrder.destination.should.be.eql(order.destination);
          receivedOrder.recipientphone.should.be.eql(order.recipientphone);
          receivedOrder.initiatorid.should.be.eql(order.initiatorid);
          receivedOrder.id.should.be.eql(order.id);
          done();
        });
    })
    .catch((error) => {
      done(error);
    });
};

const createOrder = (done) => {
  /**
   * test if we can create a new order
   * */
  const order = {
    origin: 'test-somewhere',
    destination: 'Kamembe',
    recipientPhone: '0781234567',
    comments: 'call the recipient on reception',
  };
  chai
    .request(app)
    .post('/api/v1/parcels')
    .type('application/json')
    .send(order)
    .set('authorization', `Beared ${token}`)
    .end((request, response) => {
      orderId = response.body.order.id;
      orderId = orderId.toString();
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql('Delivery order successfully created!');
      response.body.should.have.property('order');
      response.body.order.origin.should.be.eql(order.origin);
      response.body.order.destination.should.be.eql(order.destination);
      response.body.order.recipientphone.should.be.eql(order.recipientPhone);
      response.body.order.comments.should.be.eql(order.comments);
      done();
    });
};
const cannotGetOrderById = (done) => {
  /**
   * test if we can return 404 if the id is invalid and not found
   *
   */
  const id = 999999999;
  // a value we cannot have
  chai
    .request(app)
    .get(`/api/v1/parcels/${id}`)
    .set('authorization', `Beared ${token}`)
    .end((request, response) => {
      response.should.have.status(404);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('The delivery order you are looking for does not exist');
      done();
    });
};
/*
 * Test the /POST route for creating new order
 */

// check if we can update a given order for a given user
describe('cannot create order if invalid cotent', () => {
  it(
    'cannot create order if  pickup location missing',
    cannotCreateOrderOrigin,
  );
  it('return 400 if content type is not json', cannotCreateOrderBadContent);
  it(
    'cannot create order if destination is missing ',
    cannotCreateOrderDestination,
  );
  it(
    'cannot create order if recipient phone is missing',
    cannotCreateOrderRecipientPhone,
  );
});

// test get order
describe('get order by id', () => {
  before('create an order', createOrder);
  it('can get order by id', canGetOrderById);
  it('cannot get order if  id invalid', cannotGetOrderById);
});

it('return all orders as json', returnAllOrders);
