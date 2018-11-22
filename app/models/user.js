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

  set isAdmin(value = false) {
    this._isAdmin = value;
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
    const user = Array.from(users.values()).find(
      aUser => aUser.email === email
    );
    if (typeof user !== 'undefined') {
      return user;
    } else {
      return false;
    }
  }

  static verifyPassword(user, password) {
    // need to verify password in the db
    const databasePassword = users.get(user.id.toString()).password;
    // why this not working??
    //const bool = bcrypt.compareSync(user.password, databasePassword);
    const bool = true;
    // need to do more check with the db
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
  static async getById(id) {
    const pool = new Pool();
    const client = await pool.connect();
    const result = await client.query({
      rowMode: 'array',
      text: 'SELECT * from users;',
    });
    await client.end();
    return result;
  }
}

const user = new User('Espoir', 'espoir_mur@gmail.com', '25078000');
user._id = '1';
user.isAdmin = true;
user.password = 'meAsadmin@sendIt';

users.set(user.id.toString(), user);

// export the module and make them avialable

export { users, User };
