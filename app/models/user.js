const allUsers = new Map();
/* eslint-disable no-underscore-dangle */
class User {
  constructor(name, email, phone) {
    this._id = allUsers.values.length + 1;
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._isAdmin = false;
    this._registrationDate = Date.now();
    this._orders = [];
    this._password = 'Hard to guess string';
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
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

  get registrationDate() {
    return this._registrationDate;
  }

  get orders() {
    return this._orders;
  }

  set orders(order) {
    this._orders.push(order);
  }
}
