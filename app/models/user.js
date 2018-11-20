import bcrypt from 'bcryptjs';
import userOrdersRouter from '../routes/user-orders';

const users = new Map();
/* eslint-disable no-underscore-dangle */
class User {
  constructor(name, email, phone, password = 'an empty ') {
    const lengthUsers = users.size;
    this._id = lengthUsers + 1;
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._isAdmin = false;
    this._registrationDate = new Date().toJSON();
    this._orders = new Map();
    this.password = password;
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

  static findByEmail(email) {
    // return true if the user with email is already exist
    // should query the database and check if i can find user with email
    if (users.get(email)) {
      return users.get('1');
    } else {
      return users.get(1);
    }
  }

  verifyPassword() {
    // need to verify password in the db
    const databasePassword = users.get(user.id).password;
    const bool = bcrypt.compareSync(this.password, databasePassword);
    if (!bool) {
      return false;
    } else {
      return true;
    }
  }

  save() {
    /**
     *  should save the user to the db */
    const id_ = this.id.toString();
    users.set(id_, this.toJSON());
    return user.id;
  }
}

const user = new User('Espoir', 'espy_mur@gmail.com', '25078000');
users.set(user.id.toString(), user);
// export the module and make them avialable

export { users, User };
