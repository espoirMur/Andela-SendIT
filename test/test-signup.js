import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app/server';
import { encodeToken, decodeToken } from '../app/utils/authentication';
import { before } from 'mocha';

/** setting up the test server */
chai.use(chaiHttp);
const should = chai.should();

const shouldReturnToken = (done) => {
  const results = encodeToken({ id: 1 });
  should.exist(results);
  results.should.be.a('string');
  done();
};

const canDecodeToken = (done) => {
  const token = encodeToken({ id: 1 });
  should.exist(token);
  token.should.be.a('string');
  const payload = decodeToken(token);
  payload.sub.should.be.eql(1);
  done();
};
const cannotCreateIfEmailInvalid = (done) => {
  /**
   * cannot create if email is invalid or missing
   */
  const user = {
    name: 'espoir',
    email: 'aninvalidemail',
    phone: '0781234567',
    password: 'a random passord',
  };
  chai
    .request(app)
    .post('/auth/signup')
    .send(user)
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('Please provide a valid email');
      done();
    });
};

const cannotCreateIfpasswordInvalid = (done) => {
  const user = {
    name: 'espoir',
    email: 'aninvalidemail',
    phone: '0781234567',
    password: '',
  };
  chai
    .request(app)
    .post('/auth/signup')
    .send(user)
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('The password should have at least 7 characters');
      done();
    });
};

const cannotCreateIfPhoneInvalid = (done) => {
  const user = {
    name: 'espoir',
    email: 'test@test.com',
    phone: '+25',
    password: 'a random passord',
  };
  chai
    .request(app)
    .post('/auth/signup')
    .send(user)
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql(
          'Please enter a valid phone number , staring with 078, 072 or 073',
        );
      done();
    });
};

const cannotCreateIfnameInvalid = (done) => {
  const user = {
    name: '',
    email: 'aninvalidemail',
    phone: '0781234567',
    password: 'a random passord',
  };
  chai
    .request(app)
    .post('/auth/signup')
    .send(user)
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('Please provide a valid name');
      done();
    });
};

const canRegisterUser = (done) => {
  const user = {
    name: 'Espoir',
    email: 'test@test.com',
    phone: '0781234567',
    password: '98745236',
  };
  chai
    .request(app)
    .post('/auth/signup')
    .send(user)
    .end((err, response) => {
      should.not.exist(err);
      response.redirects.length.should.eql(0);
      response.status.should.eql(201);
      response.body.should.include.keys('success', 'token', 'message');
      response.body.success.should.eql(true);
      response.body.message.should.eql('The new user has been created');
      done();
    });
};

const cannotRegisterEmailTaken = (done) => {
  const user = {
    name: 'Espoir',
    email: 'test@test.com',
    phone: '0781234567',
    password: 'a new password',
  };

  chai
    .request(app)
    .post('/auth/signup')
    .send(user)
    .end((err, response) => {
      should.not.exist(err);
      response.redirects.length.should.eql(0);
      response.status.should.eql(409);
      response.body.should.include.keys('success', 'message');
      response.body.success.should.eql(false);
      response.body.message.should.eql('The email is already taken, sign in');
      done();
    });
};

describe('cannot create user if invalid content', () => {
  it('should return 400 if the name is invalid', cannotCreateIfnameInvalid);
  it('should return 400 if the phone is invalid', cannotCreateIfPhoneInvalid);
  it('should return 400 if the email is invalid', cannotCreateIfEmailInvalid);
  it(
    'should return 400 if the password is invalid',
    cannotCreateIfpasswordInvalid,
  );
});

describe('encodeToken()', () => {
  it('should return a token', shouldReturnToken);
  it('should decode token', canDecodeToken);
});

before('can create a new user', canRegisterUser);
it('cannot create if email is already taken', cannotRegisterEmailTaken);
