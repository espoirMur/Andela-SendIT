import moment from 'moment';
import jwt from 'jwt-simple';

const encodeToken = (user) => {
  // create a json web token
  const playload = {
    exp: moment()
      .add(14, 'days')
      .unix(),
    iat: moment().unix(),
    sub: user.id,
    isadmin: user.isadmin,
  };
  return jwt.encode(playload, process.env.SECRET_KEY);
};

const decodeToken = (token) => {
  const payload = jwt.decode(token, process.env.SECRET_KEY);
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) {
    return undefined;
  }
  return payload;
};

// ensure is admin
export { encodeToken, decodeToken };
