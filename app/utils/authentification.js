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

export { encodeToken, decodeToken };
