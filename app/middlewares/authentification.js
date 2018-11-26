import { decodeToken } from '../utils/authentification';
import { User } from '../models/user';

const ensureAuthentificated = async (req, res, next) => {
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
  }
  await User.getById(payload.sub)
    .then((results) => {
      if (results.rows.length === 0) {
        return res.status(404).send({
          success: false,
          message: 'user cannot be found',
        });
      }
      const user = results.rows[0];
      req.user = user;
      next();
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: 'something went wong please try again',
      });
    });
};

const checkIsAdmin = (req, res, next) => {
  // verify is the user is an admin before beforming admin actions
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
  }
  if (!payload.isadmin) {
    return res.status(403).json({
      message: 'you are not authorized to perform this action',
      success: false,
    });
  }
  // continue or getting user from db get user by id
  //  console.log({ id: parseInt(payload.sub) });
  next();
};

export { ensureAuthentificated, checkIsAdmin };
