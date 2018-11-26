/* eslint-disable comma-dangle */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { token } from './test-0Initial';

import { app } from '../app/server';

/** setting up the test server */
chai.use(chaiHttp);
const { should } = chai.should();
const { expect } = chai.expect;
let orderId;

const createOrder = (done) => {
  /**
   * test if we can create a new order
   * */
  const order = {
    origin: 'test-somewhere',
    destination: 'Kamembe',
    recipientPhone: '25078489848',
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
        .eql('delivery order successfully created!');
      response.body.should.have.property('order');
      done();
    });
};

const canChangeDestination = (done) => {
  const payload = { destination: 'kamembe' };
  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}/destination`)
    .set('authorization', `Beared ${token}`)
    .send(payload)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql(
          `delivery order destination has been changed to ${
            payload.destination
          }`
        );
      done();
    });
};

describe('can change destination of an order', () => {
  before('create an order', createOrder);
  it('can get order by id', canChangeDestination);
});
