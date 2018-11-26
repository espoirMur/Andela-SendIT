/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app/server';
import { token } from './test-0Initial';
import { decodeToken, encodeToken } from '../app/utils/authentification';
/** setting up the test server */

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;
// close the sever after running our tests
let userId;
let orderId;
const canGetUserOrders = (done) => {
  /**
   * test if we can all users delivery orders
   *
   */
  chai
    .request(app)
    .get(`/api/v1/users/${userId}/parcels`)
    .set('authorization', `Bearer ${token}`)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql('user delivery orders retrieved successfully');
      response.body.should.have.property('orders');
      done();
    });
};

const cannotGetUserOrderById = (done) => {
  /**
   * test if we can return 404 if
   * if user is not found
   *
   */
  const user = { id: 9999999, isadmin: false };

  const anotherToken = encodeToken(user);
  chai
    .request(app)
    .get(`/api/v1/users/${user.id}/parcels`)
    .set('authorization', `Bearer ${anotherToken}`)
    .end((request, response) => {
      response.should.have.status(404);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have.property('message').eql('user cannot be found');
      done();
    });
};
// check if you can get a given order for a given user

const canGetUserOrdersByid = (done) => {
  /**
   * test if we can retrieve a user order by it id
   *
   */

  chai
    .request(app)
    .get(`/api/v1/users/${userId}/parcels/${orderId}`)
    .set('authorization', `Bearer ${token}`)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql('user delivery orders retrieved successfully');
      response.body.should.have.property('order');
      done();
    });
};
const createOrder = (done) => {
  /**
   * test if we can create a new order
   * */
  userId = decodeToken(token).sub;
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
const cannotGetUserOrdersByid = (done) => {
  /**
   * test if we 404 if an order is not found for the given user
   *
   */
  const orderId404 = 9999;

  chai
    .request(app)
    .get(`/api/v1/users/${userId}/parcels/${orderId404}`)
    .set('authorization', `Bearer ${token}`)
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

describe('get user orders by id', () => {
  before('create an order', createOrder);
  it('cannot get user if  id invalid', cannotGetUserOrderById);
  it('can get user orders by id', canGetUserOrders);
});

describe('get one order for a given user', () => {
  it('cannot get order if userId not found', cannotGetUserOrdersByid);
  it('can get one order', canGetUserOrdersByid);
});
