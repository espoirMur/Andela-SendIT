import { Order } from '../models/orders';
import { queryGetId } from '../models/orderQueries';
import { decodeToken } from '../utils/authentification';

const getOrder = async (req, res, next) => {
  // called before any route where we are retreiving order by id
  // should use destructuring ask why???
  const id = req.params.orderId;
  const values = [parseInt(id, 10)];
  await Order.queryDb(queryGetId, values)
    .then((results) => {
      if (results.rows.length === 0) {
        return res.status(404).send({
          success: false,
          message: 'The delivery order you are looking for does not exist',
        });
      }
      const order = results.rows[0];
      req.order = order;
      next();
    })
    .catch((error) => error5OOHandler(error, res, req));
};

const checkCancel = (req, res, next) => {
  // get an order in the request and check if it is already delivered or cancel and return message
  const { order } = req;
  if (order.status !== 'delivered') {
    if (order.status === 'canceled') {
      return res.status(403).send({
        success: false,
        message: 'The order has already been canceled',
      });
    }
    req.order = order;
    next();
  } else {
    return res.status(403).send({
      success: false,
      message: 'Cannot update a delivered order',
    });
  }
};

const checkCreator = (req, res, next) => {
  // check if the user performing the action is allwowed
  const { order } = req;
  const header = req.headers.authorization;
  const token = header.slice(7);
  const payload = decodeToken(token);
  if (!payload.isadmin && order.initiatorid !== payload.sub) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
      success: false,
    });
  }
  req.order = order;
  next();
};
export { getOrder, checkCancel, checkCreator };
