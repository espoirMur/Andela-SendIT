/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { Pool } from 'pg';
import { dbConfigObject } from '../server';
const orders = new Map();

class Order {
  constructor(origin, destination, recipientPhone, initiatorId, comments) {
    const lengthOrders = orders.size;
    this._id = lengthOrders + 1;
    this._origin = origin;
    this._destination = destination;
    this._orderDate = new Date().toJSON();
    this._recipientPhone = recipientPhone;
    this._initiatorId = initiatorId;
    if (typeof this._comments === 'undefined') {
      /** saving null for undefined comment for validation */
      this._comments = null;
    } else {
      this._comments = comments;
    }
    this._status = 'Created';
    this._weight = 0;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get origin() {
    return this._origin;
  }

  set origin(origin) {
    this._origin = origin;
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
    if (this._status !== 'delivered') {
      this._status = status;
    } else {
      // do nothing logic is handle in the api
    }
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
    if (typeof this._comments === 'undefined') {
      /** saving null for undefined comment for validation */
      return null;
    }
    return this._comments;
  }

  set comments(comments) {
    this._comments = comments;
  }

  get initiatorId() {
    return this._initiatorId;
  }

  set initiatorId(initiatorId) {
    this._initiatorId = initiatorId;
  }

  get weight() {
    return this._weight;
  }

  set weight(weight) {
    this._weight = weight;
  }

  set presentLocation(presentLocation) {
    this._presentLocation = presentLocation;
  }

  get presentLocation() {
    return this._presentLocation;
  }

  get recipientPhone() {
    return this._recipientPhone;
  }

  set recipientPhone(recipientPhone) {
    this._recipientPhone = recipientPhone;
  }

  static async queryDb(query, values = []) {
    query.values = values;
    const pool = new Pool(dbConfigObject);
    const client = await pool.connect();
    const result = await client.query(query, values);
    await client.end();
    return result.rows;
  }
}

export { Order, orders };
