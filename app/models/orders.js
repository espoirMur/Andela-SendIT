/* eslint-disable no-underscore-dangle */
const allOrders = new Map();

class Order {
  constructor(origin, destination, recipientPhone, initiator, comments) {
    this._id = allOrders.values.length + 1;
    this._origin = origin;
    this._destination = destination;
    this._orderDate = Date.now();
    this._recipientPhone = recipientPhone;
    this._initiator = initiator;
    this._deliveryDate = '';
    this._comments = comments;
    this._status = 'Created';
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
    return this.comments;
  }

  set comments(comments) {
    this.comments = comments;
  }

  get initiator() {
    return this.initiator.name;
  }
}

export { allOrders, Order };
