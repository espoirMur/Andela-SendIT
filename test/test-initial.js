/* eslint-disable import/no-mutable-exports */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { User } from '../app/models/user';
import { encodeToken, decodeToken } from '../app/utils/authentication';
import { app } from '../app/server';

chai.use(chaiHttp);
const should = chai.should();

let token;
let testUser;

const loginUser = (done) => {
  const user = new User('test', 'test@gmail.com', '250788888', '98745236');
  user.isAdmin = true;
  user
    .save()
    .then((result) => {
      // save to the db
      token = encodeToken(result);
      testUser = result;
      chai
        .request(app)
        .post('/auth/signin')
        .send({ email: result.email, password: '98745236' })
        .end((error, response) => {
          should.not.exist(error);
          // eslint-disable-next-line prefer-destructuring
          token = response.body.token;
          token.should.be.a('string');
          const payload = decodeToken(token);
          payload.should.include.keys('sub', 'isadmin');
          result.id.should.be.eql(payload.sub);
          result.isadmin.should.be.eql(payload.isadmin);
          done();
        });
    })
    .catch((error) => {
      done(error);
    });
};

const deleteAll = (done) => {
  User.deleteAll()
    .then(() => {
      done();
    })
    .catch(done);
};

before('login the user and set the token', loginUser);
after('delete all users', deleteAll);

export { token, testUser };
