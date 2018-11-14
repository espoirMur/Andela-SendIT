/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { users } from '../app/models/user';
import app from '../app/server';

/** setting up the test server */
chai.use(chaiHttp);
const should = chai.should();
// close the sever after running our tests

const canGetUserOrders = (done) => {
  /**
   * test if we can all users delivery orders
   *
   */
  const id = 1;
  const user = users[id.toString()];
  let orders;
  if (user) {
    orders = user.orders;
  } else {
    orders = {};
  }
  chai
    .request(app)
    .get(`/api/v1/users/${id}/parcels`)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql('user delivery orders  retrieved successfully');
      response.body.should.have.property('orders');
      response.body.should.have.property('orders').eql(orders);
      done();
    });
};

const cannotGetUserOrderById = (done) => {
  /**
   * test if we can return 404 if
   * if user is not found
   *
   */
  const id = '1STFF';
  chai
    .request(app)
    .get(`/api/v1/users/${id}/parcels`)
    .end((request, response) => {
      response.should.have.status(404);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have.property('message').eql(`user with  id ${id} does not exist`);
      done();
    });
};
// check if you can get a given order for a given user

const canGetUserOrdersByid = (done) => {
  /**
   * test if we can retrieve a user order by it id
   *
   */
  const userId = '1';
  const user = users.get(userId);
  const orderId = '1';
  let order;
  if (user) {
    order = user.orders.get(orderId);
    order = order.toJSON();
  } else {
    order = {};
  }
  chai
    .request(app)
    .get(`/api/v1/users/${userId}/parcels/${orderId}`)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql('user delivery order retrieved successfully');
      response.body.should.have.property('order');
      response.body.should.have.property('order').eql(order);
      done();
    });
};

const cannotGetUserOrdersByid = (done) => {
  /**
   * test if we 404 if an order is not found for the given user
   *
   */
  const userId = '1';
  const user = users.get(userId);
  const orderId = '33332ER';
  let order;
  if (user) {
    order = user.orders.get(orderId);
  } else {
    order = {};
  }
  chai
    .request(app)
    .get(`/api/v1/users/${userId}/parcels/${orderId}`)
    .end((request, response) => {
      response.should.have.status(404);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have.property('message').eql(`order with  id ${orderId} does not exist`);
      done();
    });
};

const cannotGetUserByIdOrdersByid = (done) => {
  /**
   * test if we 404 if an order is the user id is invalid for this endpoint
   *
   */
  const userId = '2222EEE';
  const user = users.get(userId);
  const orderId = '1';
  let order;
  if (user) {
    order = user.orders.get(orderId);
  } else {
    order = {};
  }
  chai
    .request(app)
    .get(`/api/v1/users/${userId}/parcels/${orderId}`)
    .end((request, response) => {
      response.should.have.status(404);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .equals(`user with id ${userId} cannot be found`);
      done();
    });
};

const canCannotCancelOrder = (done) => {
  /**
   * test if we cannot cancel a delivery order if the status
   * marked as delivered
   */
  const userId = '1';
  const user = users.get(userId);
  const orderId = '1';
  let order;
  if (user) {
    order = user.orders.get(orderId);
  } else {
    order = {};
  }
  order.status = 'delivered';
  chai
    .request(app)
    .put(`/api/v1/users/${userId}/parcels/${orderId}/cancel`)
    .end((request, response) => {
      response.should.have.status(401);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have.property('message').eql('cannot cancel a delivered order');
      done();
    });
};

const canCancelOrder = (done) => {
  /**
   * test if we cancel a delivery order if the status
   * marked is not  delivered
   */
  const userId = '1';
  const user = users[userId];
  const orderId = '1';
  let order;
  if (user) {
    order = user.orders.get(orderId);
  } else {
    order = {};
  }
  order.status = 'canceled';
  chai
    .request(app)
    .put(`/api/v1/users/${userId}/parcels/${orderId}/cancel `)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have.property('message').eql('delivery order has been canceled');
      done();
    });
};

// check if we can update a given order for a given user
describe('get user orders by id', () => {
  it('can get user orders by id', canGetUserOrders);
  it('cannot get user if  id invalid', cannotGetUserOrderById);
});

describe('can cancel a delivery order', () => {
  it('can cancel if not delivered', canCancelOrder);
  it('cannot cancel a delivery order if it is delivered', canCannotCancelOrder);
});

describe('get one order for a given user', () => {
  it('can get one order', canGetUserOrdersByid);
  it('cannot get order for if orderId not found', cannotGetUserByIdOrdersByid);
  it('cannot get order if userId not found', cannotGetUserOrdersByid);
});
