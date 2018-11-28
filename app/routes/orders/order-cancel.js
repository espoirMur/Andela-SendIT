import { Router } from 'express';
import { Order } from '../../models/orders';

import { queryCancel } from '../../models/orderQueries';
import {
  getOrder,
  checkCancel,
  checkCreator,
} from '../../middlewares/getOrder';

const cancelRouter = Router();

cancelRouter.put(
  '/:orderId/cancel',
  getOrder,
  checkCreator,
  checkCancel,
  (req, res) => {
    const id = req.params.orderId;
    const values = [id];
    // from the middlware get order
    Order.queryDb(queryCancel, values)
      .then((result) => {
        if (result.rowCount === 1) {
          return res.status(200).send({
            success: true,
            message: 'delivery order has been canceled',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send({
          success: false,
          message: 'something went wong please try again',
        });
      });
  },
);

export default cancelRouter;
