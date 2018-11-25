import chai from 'chai';
import chaiHttp from 'chai-http';
import { User, users } from '../app/models/user';
import { app } from '../app/server';

const cannotLoginIfEmailInvalid = (done) => {
  /**
   * cannot login if email is invalid or missing
   */
  const user = {
    email: 'aninvalidemail',
    password: 'a random passord',
  };
  chai
    .request(app)
    .post('/auth/signin')
    .send(user)
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('please provide a valid email');
      done();
    });
};

const cannotloginIfpasswordInvalid = (done) => {
  const user = {
    email: 'an@test.com',
    password: '',
  };
  chai
    .request(app)
    .post('/auth/signin')
    .send(user)
    .end((request, response) => {
      response.should.have.status(400);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('the password should have at least 7 characters');
      done();
    });
};

// test if fail to verify password

const cannotLoginPasswordIncorrect = (done) => {
  const user = {
    email: 'test@test.com',
    password: 'a new 333333',
  };
  chai
    .request(app)
    .post('/auth/signin')
    .send(user)
    .end((request, response) => {
      response.should.have.status(401);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have.property('message').eql('Invalid credentials');
      done();
    });
};

const cannotLoginUserNotFOund = (done) => {
  const user = {
    email: 'an@test.com',
    password: '2224444InvalidPassword',
  };
  chai
    .request(app)
    .post('/auth/signin')
    .send(user)
    .end((request, response) => {
      response.should.have.status(404);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('User not found , please create an account');
      done();
    });
};

describe('cannot login if invalid content', () => {
  it('cannot login if invalid password', cannotloginIfpasswordInvalid),
    it('cannot login if invalid email', cannotLoginIfEmailInvalid);
});

describe('cannot login if Incorect content', () => {
  it('cannot login if incorect password', cannotLoginPasswordIncorrect),
    it('cannot login if user not found', cannotLoginUserNotFOund);
});

// login and check profile with token
