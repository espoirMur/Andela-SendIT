/* eslint-disable comma-dangle */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Order, orders } from '../app/models/orders';
import { token } from './test-0Initial';
import {
  queryGetAll,
  queryCreate,
  queryGetId,
} from '../app/models/orderQueries';

import { app } from '../app/server';
import { User } from '../app/models/user';
import { decodeToken } from '../app/utils/authentification';

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
          response.body.should.be.eql(results);
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
    origin: 'test',
    destination: 'Kamembe',
    recipientPhone: '25078489848',
    comments: 'call the recipient on reception',
  };
  const values = Object.values(order);
  values[3] = decodeToken(token).sub;
  values[4] = order.comments;
  Order.queryDb(queryCreate, values)
    .then((results) => {
      chai
        .request(app)
        .post('/api/v1/parcels')
        .type('application/json')
        .send(order)
        .set('authorization', `Beared ${token}`)
        .end((request, response) => {
          console.log(results);
          orderId = results[0].id;
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('success').eql(true);
          response.body.should.have
            .property('message')
            .eql('delivery order successfully created!');

          console.log('======', 'order id', orderId);
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
    recipientPhone: '25078489848',
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
        .eql('pickup location is required');
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
    recipientPhone: '25078489848',
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
        .eql('destination is required');
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
    recipientPhone: '',
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
        .eql('recipient phone is required');
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
    recipientPhone: '25078489848',
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
      response.body.should.have.property('message').eql('invalid content type');
      done();
    });
};

const canGetOrderById = (done) => {
  /**
   * test if we can get a delivery order by id
   *
   */
  Order.queryDb(queryGetId, [orderId])
    .then((order) => {
      chai
        .request(app)
        .get(`/api/v1/parcels/${orderId}`)
        .set('authorization', `Beared ${token}`)
        .end((request, response) => {
          const receivedOrder = response.body.order;
          console.log(receivedOrder);
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('success').eql(true);
          response.body.should.have
            .property('message')
            .eql('delivery order  retrieved successfully');
          receivedOrder.origin.should.be.eql(order[0].origin);
          receivedOrder.destination.should.be.eql(order[0].destination);
          receivedOrder.recipientphone.should.be.eql(order[0].recipientphone);
          receivedOrder.initiatorid.should.be.eql(order[0].initiatorid);
          receivedOrder.id.should.be.eql(order[0].id);
          done();
        });
    })
    .catch((error) => {
      done(error);
    });
};

const cannotGetOrderById = (done) => {
  /**
   * test if we can return 404 if the id is invalid and not found
   *
   */
  const id = -1;
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
        .eql('the delivery order you are looking for does not exist');
      done();
    });
};
/*
 * Test the /POST route for creating new order
 */

// check if we can update a given order for a given user
describe('create orders', () => {
  it('create all orders', createOrder);
  it(
    'cannot create order if  pickup location missing',
    cannotCreateOrderOrigin
  );
  it('return 400 if content type is not json', cannotCreateOrderBadContent);
  it(
    'cannot create order if destination is missing ',
    cannotCreateOrderDestination
  );
  it(
    'cannot create order if recipient phone is missing',
    cannotCreateOrderRecipientPhone
  );
});

// test get order
describe('get order by id', () => {
  it('can get order by id', canGetOrderById);
  it('cannot get order if  id invalid', cannotGetOrderById);
});

it('return all orders as json', returnAllOrders);
