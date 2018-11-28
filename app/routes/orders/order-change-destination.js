/* eslint-disable import/no-cycle */
/* eslint-disable arrow-parens */
import { Router } from 'express';
import { celebrate } from 'celebrate';
import { Order } from '../../models/orders';

import { updateDestination } from '../../models/orderSchemas';
import { queryUpdateDestination } from '../../models/orderQueries';
import {
  getOrder,
  checkCancel,
  checkCreator,
} from '../../middlewares/getOrder';

import { error5OOHandler } from '../../middlewares/errors';

const destinationRouter = Router();

destinationRouter.put(
  '/:orderId/destination',
  celebrate({ body: updateDestination }),
  getOrder,
  checkCreator,
  checkCancel,
  async (req, res) => {
    const id = parseInt(req.params.orderId, 10);
    const { destination } = req.body;
    await Order.queryDb(queryUpdateDestination, [destination, id])
      .then((result) => {
        if (result.rowCount === 1) {
          return res.status(200).send({
            success: true,
            message: `Delivery order destination has been changed to ${destination}`,
          });
        }
      })
      .catch((error) => error5OOHandler(error, res, req));
  },
);

export default destinationRouter;
