import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app/server';
/** setting up the test server */
chai.use(chaiHttp);
const should = chai.should();

const testHomePage = done => {
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
          'welcome to my apis, check the documenation for more info on how to use'
        );
      done();
    });
};
// call the test
it('test if the home page is accessible', testHomePage);
