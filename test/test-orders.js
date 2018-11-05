import { expect } from 'chai';
import request from 'request';
import { Order, allOrders } from '../app/models/orders';

const ordersUrl = 'http://localhost:3000/parcels';

const returnJson = (done) => {
  /**
   * test if We can return a json response
   */
  request(ordersUrl, (error, response, body) => {
    expect(response).to.be.json();
    done();
  });
};

const returnAllOrders = (done) => {
  /**
   * test if We  can return all orders in json format
   */
  request(ordersUrl, (error, response, body) => {
    expect(body).to.equal(JSON.stringify([...allOrders]));
    done();
  });
};

it('return Json', returnJson);
it('return all orders as json', returnAllOrders);
