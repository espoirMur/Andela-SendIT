import chai from 'chai';
import chaiHttp from 'chai-http';
import { Order, allOrders } from '../app/models/orders';
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
      response.body.should.be.eql([...allOrders]);
      done();
    });
};

const createOrder = (done) => {
  /**
   * test if we can create a new order
   * */
  const initiator = new User('espoir', 'esp@fg.com', '25078000');
  const order = new Order('Kigali', 'Gisenyi', '2507800000', initiator, 'call the recipient');
  chai
    .request(app)
    .post('/parcels')
    .send(order)
    .end((request, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('message').eql('delivery order successfully created!');
      done();
    });
};

const cannotCreateOrder = (done) => {
  /**
   * cannot create an order if  pick-up location, recipient  and recipient phone are missing
   *  */
  const initiator = new User('espoir', 'esp@fg.com', '25078000');
  const order = new Order('', '', '', initiator, 'call the recipient');

  chai
    .request(app)
    .post('/parcels')
    .send(order)
    .end((request, response) => {
      response.should.have.status(401);
      response.body.should.be.a('object');
      response.body.should.have
        .property('message')
        .eql('{"pickupLocation": "Please enter a pickuplocation"}');
      done();
    });
};

/*
  * Test the /POST route for creating new book
  */
describe('/POST book', () => {
  it('create all orders', createOrder);
  it('cannot create order if field missing', cannotCreateOrder);
});
it('return all orders as json', returnAllOrders);
