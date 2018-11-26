/* eslint-disable no-underscore-dangle */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app/server';
import { token } from '../test/test-0Initial';
/** setting up the test server */
chai.use(chaiHttp);
const should = chai.should();

const shouldRaise500 = (done) => {
  /**
   * test if We  can return all orders in json format
   */
  chai
    .request(app)
    .get('/test/errors/')
    .end((error, response) => {
      response.should.have.status(500);
      response.type.should.be.eql('application/json');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('Something went wrong!!');
      done();
    });
};

const shouldRaise404 = (done) => {
  /**
   * test if We  can raise an error 404 if the page is not found
   */
  chai
    .request(app)
    .get('/test/pageNotFound')
    .set('authorization', `Beared ${token}`)
    .end((error, response) => {
      response.should.have.status(404);
      response.type.should.be.eql('application/json');
      response.body.should.have.property('success').eql(false);
      response.body.should.have
        .property('message')
        .eql('the page you are looking for cannot be found');
      done();
    });
};

it('should return a meesage in case of 500', shouldRaise500);
it('check 404 is raise for page not found ', shouldRaise404);
