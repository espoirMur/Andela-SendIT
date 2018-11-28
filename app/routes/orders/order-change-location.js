/* eslint-disable arrow-parens */
/* eslint-disable import/no-cycle */
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
import { oderDelivered, orderLocationChanged } from '../../utils/sendEmails';
import error500Message from '../../utils/errorMessage';

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
    let mail;
    if (order.destination === location) {
      // if present location is delivered update and set values to delivered
      query = queryUpdateDeliver;
      values = [id, location];
      message = 'The order has been delivered';
      mail = oderDelivered;
    } else {
      console.log('I am inside');
      query = queryUpdateLocation;
      values = [location, id];
      message = `PresentLocation has changed  to ${location}`;
      order.location = location;
      mail = orderLocationChanged;
    }
    await Order.queryDb(query, values)
      .then((result) => {
        // send email
        if (result.rowCount === 1) {
          console.log(result);
          mail(req.user, order)
            .then((info) => {
              return res.status(200).send({
                success: true,
                message,
              });
            })
            // eslint-disable-next-line arrow-parens
            .catch((error) => error500Message(error, res));
        }
      })
      .catch((error) => error500Message(error, res));
  },
);
export default locationRouter;
