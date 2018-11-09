/* eslint-disable no-underscore-dangle */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { users } from '../app/models/user';
import app from '../app/server';

/** setting up the test server */
chai.use(chaiHttp);
const should = chai.should();
// close the sever after running our tests

const canGetUserOrderById = (done) => {
  /**
   * test if we can get a delivery order by id
   *
   */
  const id = 1;
  const user = users[id.toString()];
  // eslint-disable-next-line no-underscore-dangle
  const orders = user._orders;
  chai
    .request(app)
    .get(`/api/v1/user/${id}/parcels`)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql('user delivery orders  retrieved successfully');
      response.body.should.have.property('orders');
      response.body.orders.length.should.be.eql(orders.length);
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
    .get(`/api/v1/user/${id}/parcels`)
    .end((request, response) => {
      response.should.have.status(404);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have.property('message').eql(`user with  id ${id} does not exist`);
      done();
    });
};

describe('get user orders by id', () => {
  it('can get user orders by id', canGetUserOrderById);
  it('cannot get user if  id invalid', cannotGetUserOrderById);
});
