/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app/server';
import { token } from './test-0Initial';
import orderId from './test-orders';
import { decodeToken } from '../app/utils/authentification';
/** setting up the test server */

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;
// close the sever after running our tests
let userId;
const canGetUserOrders = (done) => {
  /**
   * test if we can all users delivery orders
   *
   */
  userId = decodeToken(token).sub;
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
  const userId404 = 9999999;
  chai
    .request(app)
    .get(`/api/v1/users/${userId404}/parcels`)
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
  it('cannot get user if  id invalid', cannotGetUserOrderById);
  it('can get user orders by id', canGetUserOrders);
});

describe('get one order for a given user', () => {
  it('cannot get order if userId not found', cannotGetUserOrdersByid);
  it('can get one order', canGetUserOrdersByid);
});
