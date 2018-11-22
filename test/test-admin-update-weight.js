import chai from 'chai';
import chaiHttp from 'chai-http';
import { Order, orders } from '../app/models/orders';
import app from '../app/server';

/** setting up the test server */
chai.use(chaiHttp);
const should = chai.should();

const createNewOrder = () => {
  const order = new Order(
    'Kigali',
    'Gisenyi',
    '2507800000',
    1,
    'call the recipient'
  );
  order.comments = 'this order will be updated';
  order.save();
};

const canChangeOrderWeight = done => {
  /**
   * test if we can update order weight
   */
  const orderId = '1';
  const statusData = { weight: 100 };
  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}/weight`)
    .send(statusData)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql('delivery order weight has been changed');
      done();
    });
};

const cannotChangeOrderWeightInvalidData = done => {
  /**
   * test if we can update order weight
   */
  const orderId = '1';
  const weightData = { weight: 'YII100' };
  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}/weight`)
    .send(weightData)
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('please provide a valid value for weight');
      done();
    });
};

const canCannotUpdateWeightOrder = done => {
  /**
   * test if we cannot update weight of  a delivery order if the status
   * marked as delivered
   * in the future we need to allow only admin or a person who create order to implement
   */
  const id = 1;
  const order = orders.get(id.toString());
  const weightData = { weight: 0 };
  order.status = 'delivered';

  chai
    .request(app)
    .put(`/api/v1/parcels/${id}/weight`)
    .send(weightData)
    .end((request, response) => {
      response.should.have.status(401);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('cannot update weight a delivered order');
      done();
    });
};

const canCannotUpdateWeightNoExistOrder = done => {
  /**
   * if we cannot update weight if don't exist
   */
  const id = '56YYYT';
  const weightData = { weight: 0 };
  chai
    .request(app)
    .put(`/api/v1/parcels/${id}/weight`)
    .send(weightData)
    .end((request, response) => {
      response.should.have.status(404);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql(`delivery order with id ${id} does not exist`);
      done();
    });
};

describe.skip('update weight of a parel', () => {
  before('create an order', createNewOrder);
  it('can update order weight ', canChangeOrderWeight);
  it('cannot change if invalid payload', cannotChangeOrderWeightInvalidData);
  it('cannot update weight if delivered', canCannotUpdateWeightOrder);
  it(
    'cannot upadete weight if order not exist',
    canCannotUpdateWeightNoExistOrder
  );
});
