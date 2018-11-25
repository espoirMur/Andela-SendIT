import { Order } from '../models/orders';
import { queryGetId } from '../models/orderQueries';

const getOrder = async (req, res, next) => {
  // called before any route where we are retreiving order by id
  // should use destructuring ask why???
  const { id } = req.params;
  await Order.queryDb(queryGetId, [parseInt(id, 10)])
    .then((results) => {
      if (results.rows.length === 0) {
        return res.status(404).send({
          success: false,
          message: 'the delivery order you are looking for does not exist',
        });
      }
      const order = results.rows[0];
      req.order = order;
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

const checkCancel = (req, res, next) => {
  // get an order in the request and check if it is already delivered or cancel and return message
  const { order } = req;
  if (order.status !== 'delivered') {
    if (order.status === 'canceled') {
      return res.status(403).send({
        success: false,
        message: 'order has already been canceled',
      });
    }
    req.order = order;
    next();
  } else {
    return res.status(403).send({
      success: false,
      message: 'cannot update a delivered order',
    });
  }
};
export { getOrder, checkCancel };
