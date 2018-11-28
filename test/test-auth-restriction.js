/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app/server';
import { describe } from 'mocha';
import { encodeToken } from '../app/utils/authentification';
import { testUser, token } from './test-initial';
chai.use(chaiHttp);
const should = chai.should();

// should return 401 status code if no token provided

const authNoToken = (done) => {
  chai
    .request(app)
    .get('/api/v1/users/1/parcels')
    .end((request, response) => {
      response.should.have.status(401);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('please provide a token');
      done();
    });
};

//
const authBadToken = (done) => {
  chai
    .request(app)
    .get('/api/v1/users/1/parcels')
    .set('authorization', `Bearer  ${'anininvalidtoken'}`)
    .end((request, response) => {
      response.should.have.status(401);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('the token provided is or expired  invalid');
      done();
    });
};

const getUserIfValidToken = (done) => {
  chai
    .request(app)
    .post('/auth/signin')
    .send({
      email: testUser.email,
      password: '98745236',
    })
    .end((error, response) => {
      should.not.exist(error);
      chai
        .request(app)
        .get(`/api/v1/users/${testUser.id}/parcels`)
        .set('authorization', `Bearer ${response.body.token}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.body.success.should.eql(true);
          done();
        });
    });
};

const cannotAccessAdminRoute = (done) => {
  const user = { id: testUser.id, isadmin: false };
  const anothertoken = encodeToken(user);
  chai
    .request(app)
    .get('/api/v1/parcels')
    .set('authorization', `Bearer ${anothertoken}`)
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.eql(403);
      res.body.success.should.eql(false);
      res.body.message.should.eql(
        'you are not authorized to perform this action',
      );
      done();
    });
};

const canAcessAdminRoute = (done) => {
  chai
    .request(app)
    .get('/api/v1/parcels')
    .set('authorization', `Bearer ${token}`)
    .end((err, res) => {
      should.not.exist(err);
      res.status.should.eql(200);
      done();
    });
};

describe('check it fall when wrong token', () => {
  it('shoudld return 401 status code if bad token was provided', authBadToken),
    it('should return 401 status code if no token provided', authNoToken);
});

describe('test admin routes ', () => {
  it('cannot access admin route if not admin', cannotAccessAdminRoute),
    it('can access admin routes', canAcessAdminRoute),
    it('can login with valid token', getUserIfValidToken);
});
