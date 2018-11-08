import chai from 'chai';
import chaiHttp from 'chai-http';
import { Order, orders } from '../app/models/orders';
import { User } from '../app/models/user';
import app from '../app/server';

/** setting up the test server */
chai.use(chaiHttp);
const should = chai.should();
// close the sever after running our tests

const returnAllOrders = (done) => {
  /**
   * test if We  can return all orders in json format
   */
  chai
    .request(app)
    .get('/parcels')
    .end((error, response) => {
      response.should.have.status(200);
      response.type.should.be.eql('application/json');
      response.body.should.be.eql(orders);
      done();
    });
};

const createOrder = (done) => {
  /**
   * test if we can create a new order
   * */
  const order = new Order('Kigali', 'Gisenyi', '2507800000', 1, 'call the recipient');
  chai
    .request(app)
    .post('/parcels')
    .type('application/json')
    .send(order)
    .end((request, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have.property('message').eql('delivery order successfully created!');
      done();
    });
};

const cannotCreateOrderOrigin = (done) => {
  /**
   * cannot create an order if  pick-up location is missing
   *  */
  const order = new Order('', 'Gisenyi', '25609888', 1, 'call the recipient');

  chai
    .request(app)
    .post('/parcels')
    .send(order)
    .type('application/json')
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have.property('message').eql('pickup location is required');
      done();
    });
};

const cannotCreateOrderDestination = (done) => {
  /**
   * cannot create an order if  destination is missing
   *  */
  const order = new Order('Gisenyi', '', '25609888', 1, 'call the recipient');

  chai
    .request(app)
    .post('/parcels')
    .send(order)
    .type('application/json')
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have.property('message').eql('destination is required');
      done();
    });
};

const cannotCreateOrderRecipientPhone = (done) => {
  /**
   * cannot create an order if  destination is missing
   *  */
  const order = new Order('Gisenyi', 'Kigali', '', 1, 'call the recipient');

  chai
    .request(app)
    .post('/parcels')
    .send(order)
    .type('application/json')
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have.property('message').eql('recipient phone is required');
      done();
    });
};

const cannotCreateOrderBadContent = (done) => {
  /**
   * should return 406 if  the content type is not json
   *  */
  const order = new Order('', '', '', 1, 'call the recipient');

  chai
    .request(app)
    .post('/parcels')
    .send(order)
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
  const id = 1;
  const order = orders[id.toString()];
  chai
    .request(app)
    .get(`/parcels/${id}`)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have.property('message').eql('delivery order  retrieved successfully');
      response.body.should.have.property('order').eql(order);
      done();
    });
};

const cannotGetOrderById = (done) => {
  /**
   * test if we can return 404 if the id is invalid and not found
   *
   */
  const id = '1STFF';
  chai
    .request(app)
    .get(`/parcels/${id}`)
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

/*
  * Test the /POST route for creating new book
  */
describe.skip('create orders', () => {
  it('create all orders', createOrder);
  it('cannot create order if  pickup location missing', cannotCreateOrderOrigin);
  it('return 400 if content type is not json', cannotCreateOrderBadContent);
  it('cannot create order if destination is missing ', cannotCreateOrderDestination);
  it('cannot create order if recipient phone is missing', cannotCreateOrderRecipientPhone);
});

// test get order
describe('get order by id', () => {
  it('can get order by id', canGetOrderById);
  it('cannot get order if  id invalid', cannotGetOrderById);
});

it('return all orders as json', returnAllOrders);
