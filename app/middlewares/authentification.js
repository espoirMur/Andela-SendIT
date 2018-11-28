/* eslint-disable arrow-parens */
import { decodeToken } from '../utils/authentification';
// eslint-disable-next-line import/no-cycle
import { User } from '../models/user';
import { error5OOHandler } from './errors';

const ensureAuthenticated = async (req, res, next) => {
  // check if authentificated before handling any request
  if (!(req.headers && req.headers.authorization)) {
    return res.status(401).json({
      success: false,
      message: 'Please provide a token',
    });
  }
  const header = req.headers.authorization;
  const token = header.slice(7);
  let payload;
  try {
    payload = decodeToken(token);
  } catch (error) {
    return res.status(401).json({
      message: 'The token provided is or expired  invalid',
      success: false,
    });
  }

  if (!payload) {
    return res.status(401).json({
      message: 'The token provided is or expired  invalid',
      success: false,
    });
  }
  // user authentficated with token
  await User.getById(payload.sub)
    .then((results) => {
      if (!results.rows.length) {
        return res.status(404).send({
          success: false,
          message: 'The User cannot be found',
        });
      }
      const user = results.rows[0];
      req.user = user;
      next();
    })
    .catch((error) => error5OOHandler(error, res, req));
};

const checkIsAdmin = (req, res, next) => {
  // verify is the user is an admin before beforming admin actions
  if (!(req.headers && req.headers.authorization)) {
    return res.status(401).json({
      success: false,
      message: 'Please provide a token',
    });
  }
  const header = req.headers.authorization;
  const token = header.slice(7);
  let payload;
  try {
    payload = decodeToken(token);
  } catch (error) {
    return res.status(401).json({
      message: 'The token provided is or expired  invalid',
      success: false,
    });
  }

  if (!payload) {
    return res.status(401).json({
      message: 'The token provided is or expired  invalid',
      success: false,
    });
  }
  if (!payload.isadmin) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
      success: false,
    });
  }
  // continue or getting user from db get user by id
  //  console.log({ id: parseInt(payload.sub) });
  next();
};

export { ensureAuthenticated, checkIsAdmin };
