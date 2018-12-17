import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app/server';
import { token } from './test-initial';
/** setting up the test server */
chai.use(chaiHttp);
const should = chai.should();

const testHomePage = (done) => {
  /**
   * call the homepage using request libary
   */
  chai
    .request(app)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.type.should.be.eql('application/json');
      response.body.should.have.property('success').eql(true);
      response.body.should.have
        .property('message')
        .eql(
          "Welcome to my apis, check the documenation <a href='https://documenter.getpostman.com/view/2725783/RzfcNXj2'>Here</a>",
        );
      done();
    });
};
// call the test

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
        .eql('The page you are looking for cannot be found');
      done();
    });
};

it.skip('check 404 is raise for page not found ', shouldRaise404);
it.skip('test if the home page is accessible', testHomePage);
