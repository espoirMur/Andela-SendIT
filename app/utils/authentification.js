import moment from 'moment';
import jwt from 'jwt-simple';

const encodeToken = user => {
  // create a json web token
  const playload = {
    exp: moment()
      .add(14, 'days')
      .unix(),
    iat: moment().unix(),
    sub: user.id,
  };
  return jwt.encode(playload, 'A secret code to put in venv');
};

const decodeToken = (token, callback) => {
  const payload = jwt.decode(token, 'A secret code to put in venv');
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) callback('Token has expired.');
  else callback(null, payload);
};

const ensureAuthentificated = (req, resp, next) => {
  // check if authentificated before handling any request
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({
      sucess: false,
      message: 'please log in',
    });
  }
  const header = req.headers.authorization.split(' ');
  const token = header[1];

  decodeToken(token, (err, payload) => {
    if (token) {
      if (err) {
        return res.status(401).json({
          message: 'Token has expired',
          status: false,
        });
      } else {
        // continue or getting user from db get user by id
        console.log({ id: parseInt(payload.sub) });
        next();
      }
    } else {
      return res.status(401).json({
        message: 'please provide a token',
        status: false,
      });
    }
  });
};

// ensure is admin
export { encodeToken, decodeToken, ensureAuthentificated };
