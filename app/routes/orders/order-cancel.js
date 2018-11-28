/* eslint-disable arrow-parens */
/* eslint-disable import/no-cycle */
import { Router } from 'express';
import { Order } from '../../models/orders';

import { queryCancel } from '../../models/orderQueries';
import {
  getOrder,
  checkCancel,
  checkCreator,
} from '../../middlewares/getOrder';

import error500Message from '../../utils/errorMessage';
import { orderCanceled } from '../../utils/sendEmails';

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
        // send email
        if (result.rowCount === 1) {
          orderCanceled(req.user, req.order)
            .then((info) => {
              return res.status(200).send({
                success: true,
                message: 'Delivery order has been canceled',
              });
            })
            // eslint-disable-next-line arrow-parens
            .catch((error) => error500Message(error, res));
        }
      })
      .catch((error) => error500Message(error, res));
  },
);

export default cancelRouter;
