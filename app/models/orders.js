/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

import { users, User } from './user';

const orders = new Map();

class Order {
  constructor(origin, destination, recipientPhone, initiatorId, comments) {
    const lengthOrders = orders.size;
    this._id = lengthOrders + 1;
    this._origin = origin;
    this._destination = destination;
    this._orderDate = Date.now();
    this._recipientPhone = recipientPhone;
    this._initiatorId = initiatorId;
    this._deliveryDate = '';
    if (typeof comments === 'undefined') {
      /** saving null for undefined comment for validation */
      this._comments = null;
    } else {
      this._comments = comments;
    }
    this._status = 'Created';
    this._weight = 0;
  }

  save() {
    /**
     *  save the object to the file */
    const id_ = this.id.toString();
    // adding the file to the previous one
    orders.set(id_, this.toJSON());
    // save to user
    const user = users.get(this.initiatorId.toString());
    user.orders = this;
  }

  remove() {
    /**
     *  remove the object from the file */
    const id_ = this.id.toString();

    if (orders.delete(id_)) {
      // delete if exist
      console.log('delete');
    } else {
      throw new Error(`Order with id ${id_} was not found`);
    }
    /*
    *const data = JSON.stringify(orders, null, 2);
    * save
    * const orderPath = path.join(__dirname, 'orders.json');
    *fs.writeFile(orderPath, data, (err) => {
     * if (err) throw err;
    *}); */
  }

  get id() {
    return this._id;
  }

  get origin() {
    return this._origin;
  }

  get destination() {
    return this._destination;
  }

  set destination(destination) {
    // this can be done by admins only
    this._destination = destination;
  }

  get status() {
    return this._status;
  }

  set status(status) {
    // only changed if not delivered
    this._status = status;
  }

  get orderDate() {
    return this._orderDate;
  }

  get deliveryDate() {
    return this._deliveryDate;
  }

  set deliveryDate(deliveryDate) {
    // only admins can update this
    this._deliveryDate = deliveryDate;
  }

  get comments() {
    if (this._comments) {
      return this._comments;
    }
    return '';
  }

  set comments(comments) {
    this._comments = comments;
  }

  get initiatorId() {
    return this._initiatorId;
  }

  set initiatorId(initiatorId) {
    throw new Error(`cannot change initiator ${this._initiatorId} to ${initiatorId}`);
  }

  get weigh() {
    return this._weight;
  }

  set weigh(weight) {
    this._weight = weight;
  }

  toJSON() {
    /**
     *  convert the object to json
     * */
    return Object.getOwnPropertyNames(this).reduce((a, b) => {
      a[b.replace('_', '')] = this[b];
      return a;
    }, {});
  }

  static OrderMapToJson(allOrders) {
    const OrderJson = {};
    allOrders.forEach((v, k) => {
      OrderJson[k] = v;
    });
    return OrderJson;
  }
}

export { Order, orders };
