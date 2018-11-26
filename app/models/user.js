import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import {
  queryCreate,
  queryEmail,
  queryId,
  queryDeleteAll,
} from './userQueries';

import { dbConfigObject } from '../server';

/* eslint-disable no-underscore-dangle */
class User {
  constructor(name, email, phone, password = 'an empty ') {
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._isAdmin = false;
    this.password = password;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  set password(password) {
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);
    this._password = passwordHash;
  }

  get password() {
    // change with sql query
    return this._password;
  }

  get email() {
    return this._email;
  }

  set email(email) {
    this._email = email;
  }

  get phone() {
    return this._phone;
  }

  set phone(phone) {
    this._phone = phone;
  }

  get isAdmin() {
    return this._isAdmin;
  }

  set isAdmin(value) {
    this._isAdmin = value;
  }

  get registrationDate() {
    return this._registrationDate;
  }

  static verifyPassword(databasePassword, password) {
    // need to verify password in the db
    const matched = bcrypt.compareSync(password, databasePassword);
    return matched;
  }

  async save() {
    /**
     *  should save the user to the db */
    queryCreate.values = [
      this.name,
      this.email,
      this.password,
      this.phone,
      this.isAdmin,
    ];
    console.log(dbConfigObject, '===============');
    const pool = new Pool(dbConfigObject);
    const client = await pool.connect();
    const result = await client.query(queryCreate);
    await client.end();
    return result.rows[0];
  }

  static async getById(id) {
    queryId.values = [id];
    const pool = new Pool(dbConfigObject);
    const client = await pool.connect();
    const result = await client.query(queryId);
    await client.end();
    return result;
  }

  static async deleteAll() {
    const pool = new Pool(dbConfigObject);
    const client = await pool.connect();
    const result = await client.query(queryDeleteAll);
    await client.end();
    return result;
  }

  static async findByEmail(email) {
    queryEmail.values = [email];
    const pool = new Pool(dbConfigObject);
    const client = await pool.connect();
    const result = await client.query(queryEmail);
    await client.end();
    if (result.rows.length === 0) {
      return false;
    }
    return result.rows[0];
  }
}

// export the module and make them avialable

// eslint-disable-next-line import/prefer-default-export
export { User };
