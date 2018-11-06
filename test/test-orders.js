import { expect } from 'chai';
import request from 'request';
import { Order, allOrders } from '../app/models/orders';

const ordersUrl = 'http://localhost:3000/parcels';

const returnAllOrders = (done) => {
  /**
   * test if We  can return all orders in json format
   */
  request(ordersUrl, (error, response, body) => {
    // eslint-disable-next-line no-unused-expressions
    expect(response.statusCode).to.be.equals(200);
    expect(body).to.equal(JSON.stringify([...allOrders]));
    done();
  });
};

it('return all orders as json', returnAllOrders);
