import chai from 'chai';
import chaiHttp from 'chai-http';
import { User, users } from '../app/models/user';
import app from '../app/server';
import { describe } from 'mocha';

chai.use(chaiHttp);
const should = chai.should();

// should return 401 status code if no token provided

const authNoToken = done => {
  chai
    .request(app)
    .get('/api/v1/users/1/parcels')
    .end((request, response, next) => {
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
const authBadToken = done => {
  chai
    .request(app)
    .get('/api/v1/users/1/parcels')
    .set('authorization', 'Bearer ' + 'anininvalidtoken')
    .end((request, response, next) => {
      response.should.have.status(401);
      response.body.should.be.a('object');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('the token provided is or expired  invalid');
      done();
    });
};

const getUserIfValidToken = done => {
  const user = users.get('1');
  chai
    .request(app)
    .post('/auth/signin')
    .send({
      email: user.email,
      password: 'a new password',
    })
    .end((error, response) => {
      should.not.exist(error);
      chai
        .request(app)
        .get('/api/v1/users/1/parcels')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.body.success.should.eql(true);
          done();
        });
    });
};

const cannotAccessAdminRoute = done => {
  const user = users.get('1');
  chai
    .request(app)
    .post('/auth/signin')
    .send({
      email: user.email,
      password: 'a new password',
      isAdmin: false,
    })
    .end((error, response) => {
      should.not.exist(error);
      chai
        .request(app)
        .get('/api/v1/parcels')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(403);
          res.body.success.should.eql(false);
          res.body.message.should.eql(
            'you are not authorized to perform this action'
          );
          done();
        });
    });
};

const canAcessAdminRoute = done => {
  const user = users.get('1');
  chai
    .request(app)
    .post('/auth/signin')
    .send({
      email: user.email,
      password: 'a new password',
      isAdmin: false,
    })
    .end((error, response) => {
      should.not.exist(error);
      chai
        .request(app)
        .get('/api/v1/parcels')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          done();
        });
    });
};

describe('check it fall when wrong token', () => {
  it('shoudld return 401 status code if bad token was provided', authBadToken),
    it('should return 401 status code if no token provided', authNoToken);
});
it('can login with valid token', getUserIfValidToken);

describe('test admin routes ', () => {
  it('cannot access admin route if not admin', cannotAccessAdminRoute),
    it('can access admin routes', canAcessAdminRoute);
});
//it responds with 200 status code if good authorization header
