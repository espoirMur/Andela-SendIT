/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { Pool } from 'pg';

import dbConfigObject from '../../config';
import { queryCreate } from './orderQueries';

class Order {
  constructor(origin, destination, recipientPhone, initiatorId, comments) {
    this.origin = origin;
    this.destination = destination;
    this.recipientPhone = recipientPhone;
    this.initiatorId = initiatorId;
    this.comments = comments;
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

  get recipientPhone() {
    return this._recipientPhone;
  }

  set recipientPhone(recipientPhone) {
    this._recipientPhone = recipientPhone;
  }

  set destination(destination) {
    // this can be done by admins only
    this._destination = destination;
  }

  get orderDate() {
    return this._orderDate;
  }

  get comments() {
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

  static async queryDb(query, values = []) {
    query.values = values;
    const pool = new Pool(dbConfigObject);
    const client = await pool.connect();
    const result = await client.query(query, values);
    await client.end();
    return result;
  }

  async save() {
    /**
     *  should save the order in the db */
    queryCreate.values = [
      this.origin,
      this.destination,
      this.recipientPhone,
      this.initiatorId,
      this.comments,
    ];
    const pool = new Pool(dbConfigObject);
    const client = await pool.connect();
    const result = await client.query(queryCreate);
    await client.end();
    return result.rows[0];
  }
}

// eslint-disable-next-line import/prefer-default-export
export { Order };
