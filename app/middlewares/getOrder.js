import { Order } from '../models/orders';
import { queryGetId } from '../models/orderQueries';

const getOrder = async (req, res, next) => {
  // called before any route where we are retreiving order by id
  await Order.queryDb(queryGetId, [req.params.id])
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

export default getOrder;
