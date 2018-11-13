const users = new Map();
/* eslint-disable no-underscore-dangle */
class User {
  constructor(name, email, phone) {
    const lengthUsers = users.size;
    this._id = lengthUsers + 1;
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._isAdmin = false;
    this._registrationDate = Date.now();
    this._orders = new Map();
    this._password = 'Hard to guess string';
  }

  get id() {
    return this._id;
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
    this._orders.set(order.id.toString(), order);
  }

  toJSON() {
    return Object.getOwnPropertyNames(this).reduce((a, b) => {
      // eslint-disable-next-line no-param-reassign
      a[b.replace('_', '')] = this[b];
      return a;
    }, {});
  }
}

const user = new User('Espoir', 'espy_mur@gmail.com', '25078000');
users.set(user.id.toString(), user);
// export the module and make them avialable

export { users, User };
