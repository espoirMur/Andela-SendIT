import chai from 'chai';
import chaiHttp from 'chai-http';
import { Order, orders } from '../app/models/orders';
import { token } from './test-0Initial';
import { app } from '../app/server';

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

const canCannotCancelOrder = (done) => {
  /**
   * test if we cannot cancel a delivery order if the status
   * marked as delivered
   * in the future we need to allow only admin or a person who create order to implement
   */
  console.log(orderId, '=======', orderId);
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
        .eql('cannot cancel a delivered order');
      done();
    });
};

const canCancelOrder = (done) => {
  /**
   * test if we cancel a delivery order if the status
   * marked is not  delivered
   */

  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}/cancel `)
    .set('authorization', `Beared ${token}`)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql('delivery order has been canceled');
      done();
    });
};

const canCannotCancelOrderCanceled = (done) => {
  /**
   * test if we cannot cancel a delivery order if the status
   * cannot cancel an already canceled orders
   */
  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}/cancel`)
    .set('authorization', `Beared ${token}`)
    .end((request, response) => {
      response.should.have.status(403);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('order has already been canceled');
      done();
    });
};

const canCannotCancelNoExistOrder = (done) => {
  /**
   * if we cannot cancel and order if it doesn't exist
   */
  const id = '999999';
  chai
    .request(app)
    .put(`/api/v1/parcels/${id}/cancel `)
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

// test cancel order
describe('cancel order', () => {
  before('create new order', createOrder);
  it('can cancel order', canCancelOrder);
  it.skip('cannot cancel if delivered', canCannotCancelOrder);
  it('cannot cancel non existant order', canCannotCancelNoExistOrder);
  it('cannot cancel if already canceled', canCannotCancelOrderCanceled);
});
