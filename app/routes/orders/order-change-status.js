/* eslint-disable import/no-cycle */
import Router from 'express';
import { celebrate } from 'celebrate';
import { getOrder, checkCancel } from '../../middlewares/getOrder';
import { Order } from '../../models/orders';
import { checkIsAdmin } from '../../middlewares/authentication';
import { updateStatus } from '../../models/orderSchemas';
import {
  queryUpdateStatus,
  queryUpdateWeight,
} from '../../models/orderQueries';
import { orderStatusChanged, orderRecieved } from '../../utils/sendEmails';
import { error5OOHandler } from '../../middlewares/errors';

const statusRouter = Router();

statusRouter.put(
  '/:orderId/status',
  checkIsAdmin,
  celebrate({ body: updateStatus }),
  getOrder,
  checkCancel,
  async (req, res) => {
    const { status, weight } = req.body;
    const id = req.params.orderId;
    const { order } = req;
    let query;
    let values;
    let message;
    let mail;
    if (order.status === 'created' && status === 'received' && weight) {
      // update parcel weight calculate the price and send a mail  to client
      const price = weight * 4000;
      const trackingNumber = `SENDIT-${Date.now()}-${order.id}`;
      query = queryUpdateWeight;
      values = [weight, status, price, trackingNumber, id];
      order.trackingNumber = trackingNumber;
      message =
        'We have recieved your order , please checkout the invoice sent via mail';
      mail = orderRecieved;
    } else {
      query = queryUpdateStatus;
      message = `Delivery order status has been changed to ${status}`;
      values = [status, id];
      mail = orderStatusChanged;
    }

    await Order.queryDb(query, values)
      .then((result) => {
        if (result.rowCount === 1) {
          mail(req.user, order)
            .then((info) => {
              return res.status(200).send({
                success: true,
                message,
              });
            })
            // eslint-disable-next-line arrow-parens
            .catch((error) => error5OOHandler(error, res, req));
        }
      })
      // eslint-disable-next-line arrow-parens
      .catch((error) => error5OOHandler(error, res, req));
  },
);

export default statusRouter;
