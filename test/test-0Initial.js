import chai from 'chai';
import chaiHttp from 'chai-http';
import { User, users } from '../app/models/user';
import { encodeToken, decodeToken } from '../app/utils/authentification';
import { app } from '../app/server';
chai.use(chaiHttp);
const should = chai.should();

let token;
let testUser;

const loginUser = done => {
  const user = new User('test', 'test@gmail.com', '250788888', '98745236');
  user.isAdmin = true;
  user
    .save()
    .then(result => {
      // save to the db
      token = encodeToken(result);
      testUser = result;
      console.log('================', result);
      console.log(decodeToken(token));
      chai
        .request(app)
        .post('/auth/signin')
        .send({ email: result.email, password: '98745236' })
        .end((error, response) => {
          should.not.exist(error);
          token = response.body.token;
          //token.should.not.be(undefined);
          token.should.be.a('string');
          done();
        });
    })
    .catch(error => {
      done(error);
    });
};

const deleteAll = done => {
  User.deleteAll()
    .then(result => {
      console.log(result);
      done();
    })
    .catch(done);
};
before('login the user and set the token', loginUser);
after('delete all users', deleteAll);

export { token, testUser };
