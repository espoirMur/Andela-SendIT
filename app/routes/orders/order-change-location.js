import { Router } from 'express';
import { celebrate } from 'celebrate';
import { Order } from '../../models/orders';
import { checkIsAdmin } from '../../middlewares/authentification';
import { updateLocation } from '../../models/orderSchemas';
import {
  queryUpdateDeliver,
  queryUpdateLocation,
} from '../../models/orderQueries';
import { getOrder, checkCancel } from '../../middlewares/getOrder';

const locationRouter = Router();

locationRouter.put(
  '/:orderId/presentLocation',
  checkIsAdmin,
  celebrate({ body: updateLocation }),
  getOrder,
  checkCancel,
  async (req, res) => {
    const { order } = req;
    const { location } = req.body;
    const id = req.params.orderId;
    let query;
    let values;
    let message;
    if (order.destination === location) {
      // if present location is delivered update and set values to delivered
      query = queryUpdateDeliver;
      values = [id, location];
      message = 'The order has been delivered';
    } else {
      query = queryUpdateLocation;
      values = [location, id];
      message = `presentLocation has changed  to ${location}`;
    }
    await Order.queryDb(query, values)
      .then((result) => {
        // send email
        if (result.rowCount === 1) {
          return res.status(200).send({
            success: true,
            message,
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
export default locationRouter;
