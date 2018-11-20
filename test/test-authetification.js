import chai from 'chai';
import chaiHttp from 'chai-http';
import { User, users } from '../app/models/user';
import app from '../app/server';
import { encodeToken, decodeToken } from '../app/utils/authentification';

/** setting up the test server */
chai.use(chaiHttp);
const should = chai.should();

const shouldReturnToken = done => {
  const results = encodeToken({ id: 1 });
  should.exist(results);
  results.should.be.a('string');
  done();
};

const canDecodeToken = done => {
  const token = encodeToken({ id: 1 });
  should.exist(token);
  token.should.be.a('string');
  decodeToken(token, (err, res) => {
    should.not.exist(err);
    res.sub.should.eql(1);
    done();
  });
};
const cannotCreateIfEmailInvalid = done => {
  /**
   * cannot create if email is invalid or missing
   */
  const user = {
    name: 'espoir',
    email: 'aninvalidemail',
    phone: '+2507000000000',
    password: 'a random passord',
  };
  chai
    .request(app)
    .post('/auth/signup')
    .send(user)
    .end((request, response) => {
      response.should.have.status(401);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('please provide a valid email');
      done();
    });
};

const cannotCreateIfpasswordInvalid = done => {
  const user = {
    name: 'espoir',
    email: 'aninvalidemail',
    phone: '+2507000000000',
    password: '',
  };
  chai
    .request(app)
    .post('/auth/signup')
    .send(user)
    .end((request, response) => {
      response.should.have.status(401);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('the password should have at least 7 characters');
      done();
    });
};

const cannotCreateIfPhoneInvalid = done => {
  const user = {
    name: 'espoir',
    email: 'aninvalidemail',
    phone: '+25',
    password: 'a random passord',
  };
  chai
    .request(app)
    .post('/auth/signup')
    .send(user)
    .end((request, response) => {
      response.should.have.status(401);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('Invalid phone number , please put a number staring with +250');
      done();
    });
};

const cannotCreateIfnameInvalid = done => {
  const user = {
    name: '',
    email: 'aninvalidemail',
    phone: '+2507000000000',
    password: 'a random passord',
  };
  chai
    .request(app)
    .post('/auth/signup')
    .send(user)
    .end((request, response, error) => {
      response.should.have.status(401);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('please provide a valid name');
      done();
    });
};

const canRegisterUser = done => {
  const user = new User(
    'Espoir',
    'espy_mur@gmail.com',
    '25078000',
    'myPassword1234'
  );
  chai
    .request(app)
    .post('/auth/signup')
    .send(user)
    .end((err, response) => {
      should.not.exist(err);
      response.redirects.length.should.eql(0);
      response.status.should.eql(201);
      response.body.should.include.keys(
        'success',
        'token',
        'message',
        'userId'
      );
      response.body.success.should.eql(true);
      response.body.message.should.eql('the new user has been created'), done();
    });
};
/*
it('should register a new user and return token', () => {});
it('should return bad request if the email is already used', () => {});
it('should return bad request if any field is not valid (email, phone, password)', () => {});
it('should return 400 if the name is invalid', () => {});
// login
it('should login a user and send valid token', () => {});
it('should send 401 if the password is invalid', () => {});
it('should login a user and send valid token and check if the token is okey', () => {});
*/
//reset password

// logout

describe('cannot create user if invalid content', () => {
  it.skip(
    'should return 400 if the name is invalid',
    cannotCreateIfnameInvalid
  );
  it.skip(
    'should return 400 if the phone is invalid',
    cannotCreateIfPhoneInvalid
  );
  it.skip(
    'should return 400 if the email is invalid',
    cannotCreateIfEmailInvalid
  );
  it.skip(
    'should return 400 if the password is invalid',
    cannotCreateIfpasswordInvalid
  );
});

describe('encodeToken()', () => {
  it('should return a token', shouldReturnToken);
  it('should decode token', canDecodeToken);
});

it('can create a new user', canRegisterUser);
