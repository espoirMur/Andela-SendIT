import chai from 'chai';
import chaiHttp from 'chai-http';
import { Order, orders } from '../app/models/orders';
import app from '../app/server';

/** setting up the test server */
chai.use(chaiHttp);
const should = chai.should();

const returnAllOrders = (done) => {
  /**
   * test if We  can return all orders in json format
   */
  chai
    .request(app)
    .get('/api/v1/parcels')
    .end((error, response) => {
      response.should.have.status(200);
      response.type.should.be.eql('application/json');
      response.body.should.be.eql(Order.OrderMapToJson(orders));
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
    .post('/api/v1/parcels')
    .type('application/json')
    .send(order.toJSON())
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
    .post('/api/v1/parcels')
    .send(order.toJSON())
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
    .post('/api/v1/parcels')
    .send(order.toJSON())
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
    .post('/api/v1/parcels')
    .send(order.toJSON())
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
    .post('/api/v1/parcels')
    .send(order.toJSON())
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
  const order = orders.get(id.toString());
  chai
    .request(app)
    .get(`/api/v1/parcels/${id}`)
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
    .get(`/api/v1/parcels/${id}`)
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

const canCannotCancelOrder = (done) => {
  /**
   * test if we cannot cancel a delivery order if the status
   * marked as delivered
   * in the future we need to allow only admin or a person who create order to implement
   */
  const id = 1;
  const order = orders.get(id.toString());
  order.status = 'delivered';
  chai
    .request(app)
    .put(`/api/v1/parcels/${id}/cancel `)
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
  const id = 1;
  const order = orders.get(id.toString());
  order.status = 'canceled';
  chai
    .request(app)
    .put(`/api/v1/parcels/${id}/cancel `)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have.property('message').eql('delivery order has been canceled');
      done();
    });
};

const canCannotCancelNoExistOrder = (done) => {
  /**
   * if we cannot cancel and order if it doesn't exist
   */
  const id = '56YYYT';
  chai
    .request(app)
    .put(`/api/v1/parcels/${id}/cancel `)
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

const cannotChangepresentLocationDelivered = (done) => {
  /**
   * test if we cannot change present location a delivery order if the status
   * marked as delivered
   */
  const orderId = '1';
  const order = orders.get(orderId);
  order.status = 'delivered';
  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}`)
    .send(order)
    .end((request, response) => {
      response.should.have.status(401);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('cannot change the present location or status  of  a delivered order');
      done();
    });
};

const canChangepresentLocation = (done) => {
  /**
   * test if we can change the present location if the status
   * marked is not  delivered
   */
  const orderId = '1';
  const presentLocationData = { presentLocation: 'kamembe' };
  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}`)
    .send(presentLocationData)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql('delivery order  present location has been changed');
      done();
    });
};

const cannotChangePresentLocationOrderMissing = (done) => {
  /**
   * cannot update the present location if it missing in payload
   *  */
  const order = new Order();

  order.origin = 'Goma';
  order.weight = 500;
  order.presentLocation = undefined;
  order.initiatorId = 1;
  order.status = undefined;
  order.save();
  chai
    .request(app)
    .put(`/api/v1/parcels/${order.id}`)
    .send(order.toJSON())
    .type('application/json')
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('either present location or status is required');
      done();
    });
};

const canChangeStatusOrder = (done) => {
  /**
   * test if we can change the status of an order
   */
  const orderId = '1';
  const statusData = { status: 'en route for delivery' };
  chai
    .request(app)
    .put(`/api/v1/parcels/${orderId}`)
    .send(statusData)
    .end((request, response) => {
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(true);
      response.body.should.have.property('message').eql('delivery order status has been changed');
      done();
    });
};

/*
  * Test the /POST route for creating new order
  */
describe('create orders', () => {
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

describe('can change cancel, update parcel', () => {
  it('can cancel order by id', canCancelOrder);
  it('can change present location', canChangepresentLocation);
  it('can change status of a parcel delivery', canChangeStatusOrder);
});

// test cancel order
describe('cannot update order', () => {
  it('cannot  change present location if delivered', cannotChangepresentLocationDelivered);
  it('cannot cancel if delivered', canCannotCancelOrder);
  it('cannot cancel non existant order', canCannotCancelNoExistOrder);
  it('cannot change if present location is missing ', cannotChangePresentLocationOrderMissing);
});

it('return all orders as json', returnAllOrders);
