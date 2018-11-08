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
  const initiator = new User('espoir', 'esp@fg.com', '25078000');
  const order = new Order('', 'Gisenyi', '25609888', initiator, 'call the recipient');

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
  const initiator = new User('espoir', 'esp@fg.com', '25078000');
  const order = new Order('Gisenyi', '', '25609888', initiator, 'call the recipient');

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
  const initiator = new User('espoir', 'esp@fg.com', '25078000');
  const order = new Order('Gisenyi', 'Kigali', '', initiator, 'call the recipient');

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
  const initiator = new User('espoir', 'esp@fg.com', '25078000');
  const order = new Order('', '', '', initiator, 'call the recipient');

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

/*
  * Test the /POST route for creating new book
  */
describe('/POST book', () => {
  it('create all orders', createOrder);
  it('cannot create order if  pickup location missing', cannotCreateOrderOrigin);
  it('return 400 if content type is not json', cannotCreateOrderBadContent);
  it('cannot create order if destination is missing ', cannotCreateOrderDestination);
  it('cannot create order if recipient phone is missing', cannotCreateOrderRecipientPhone);
});
it('return all orders as json', returnAllOrders);
