/* eslint-disable comma-dangle */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { token } from './test-initial';

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
          `Delivery order destination has been changed to ${
            payload.destination
          }`,
        );
      done();
    });
};

const canChangeStatus = (done) => {
  const payload = { status: 'en route to destination' };
  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}/status`)
    .set('authorization', `Beared ${token}`)
    .send(payload)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql(`Delivery order status has been changed to ${payload.status}`);
      done();
    });
};

const canChangeStatusWeight = (done) => {
  const payload = {
    status: 'received',
    weight: 100,
  };
  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}/status`)
    .set('authorization', `Beared ${token}`)
    .send(payload)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql(
          'We have recieved your order , please checkout the invoice sent via mail',
        );
      done();
    });
};

const canChangePresentLocation = (done) => {
  const payload = { location: 'somewhere in test' };
  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}/presentLocation`)
    .set('authorization', `Beared ${token}`)
    .send(payload)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql(`PresentLocation has changed  to ${payload.location}`);
      done();
    });
};

const canChangePresentLocationDeliver = (done) => {
  const payload = { location: 'kamembe' };
  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}/presentLocation`)
    .set('authorization', `Beared ${token}`)
    .send(payload)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql('The order has been delivered');
      done();
    });
};

const canCannotCancelOrder = (done) => {
  /**
   * test if we cannot cancel a delivery order if the status
   * marked as delivered
   * in the future we need to allow only admin or a person who create order to implement
   */
  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}/cancel `)
    .set('authorization', `Beared ${token}`)
    .end((request, response) => {
      response.should.have.status(403);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('Cannot update a delivered order');
      done();
    });
};
describe('can update an order', () => {
  before('create an order', createOrder);
  it('can get order by id', canChangeDestination);
  it('can change status and weight', canChangeStatusWeight).timeout(10000);
  it('can change the status of the delivery order', canChangeStatus).timeout(
    10000,
  );
  it('can change present location', canChangePresentLocation).timeout(10000);
  it(
    'change present location  to deliver',
    canChangePresentLocationDeliver,
  ).timeout(10000);
  it('cannot cancel if delivered', canCannotCancelOrder);
});
