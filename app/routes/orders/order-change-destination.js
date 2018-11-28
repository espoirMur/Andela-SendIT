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
            message: `delivery order destination has been changed to ${destination}`,
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

export default destinationRouter;
