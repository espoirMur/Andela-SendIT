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

const decodeToken = token => {
  const payload = jwt.decode(token, 'A secret code to put in venv');
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) {
    return undefined;
  } else return payload;
};

const ensureAuthentificated = (req, res, next) => {
  // check if authentificated before handling any request
  if (!(req.headers && req.headers.authorization)) {
    return res.status(401).json({
      success: false,
      message: 'please provide a token',
    });
  }
  const header = req.headers.authorization;
  const token = header.slice(7);
  let payload;
  try {
    payload = decodeToken(token);
  } catch (error) {
    return res.status(401).json({
      message: 'the token provided is or expired  invalid',
      success: false,
    });
  }

  if (!payload) {
    return res.status(401).json({
      message: 'the token provided is or expired  invalid',
      success: false,
    });
  } else {
    // continue or getting user from db get user by id
    //console.log({ id: parseInt(payload.sub) });
    next();
  }
};

// ensure is admin
export { encodeToken, decodeToken, ensureAuthentificated };
