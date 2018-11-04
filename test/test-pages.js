// eslint-disable-next-line prefer-destructuring
const expect = require('chai').expect;
const request = require('request');

const homeUrl = 'http://localhost:3000';

const homePage = (done) => {
  /**
   * call the homepage using request libary
   */
  request(homeUrl, (error, response, body) => {
    expect(body).to.equals('Hello From Express App');
    done();
  });
};
// call the test
it('homePage', homePage);
