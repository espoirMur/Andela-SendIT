/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/no-cycle */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-else-return */
import { Router } from 'express';
import { celebrate } from 'celebrate';
import { Order } from '../models/orders';
import { checkIsAdmin } from '../middlewares/authentification';
import { decodeToken } from '../utils/authentification';
import {
  createOrder,
  updateDestination,
  updateStatus,
  updateLocation,
} from '../models/orderSchemas';
import {
  queryGetAll,
  queryCancel,
  queryUpdateDestination,
  queryUpdateStatus,
  queryUpdateDeliver,
  queryUpdateLocation,
  queryUpdateWeight,
} from '../models/orderQueries';
import { getOrder, checkCancel, checkCreator } from '../middlewares/getOrder';

const router = Router();

router.get('/', checkIsAdmin, async (req, res) => {
  await Order.queryDb(queryGetAll)
    .then((results) => {
      return res.status(200).json(results.rows);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: 'something went wong please try again',
      });
    });
});

router.post('/', celebrate({ body: createOrder }), async (req, res) => {
  const contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0) {
    return res.status(406).send({
      success: false,
      message: 'invalid content type',
    });
  }
  const orderDetails = req.body;
  const header = req.headers.authorization;
  const token = header.slice(7);
  const payload = decodeToken(token);
  const initiatorId = payload.sub;

  // should I delete Order class?
  const order = new Order(
    orderDetails.origin,
    orderDetails.destination,
    orderDetails.recipientPhone,
    initiatorId,
    orderDetails.comments,
  );

  await order
    .save()
    .then((result) => {
      res.status(201).send({
        success: true,
        message: 'delivery order successfully created!',
        order: result,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: 'something went wong please try again',
      });
    });
});

router.get('/:orderId', checkIsAdmin, getOrder, async (req, res) => {
  return res.status(200).send({
    success: true,
    message: 'delivery order  retrieved successfully',
    order: req.order,
  });
});

router.put(
  '/:orderId/cancel',
  getOrder,
  checkCreator,
  checkCancel,
  (req, res) => {
    const id = req.params.orderId;
    // from the middlware get order
    Order.queryDb(queryCancel, [id])
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

router.put(
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

router.put(
  '/:orderId/status',
  checkIsAdmin,
  celebrate({ body: updateStatus }),
  getOrder,
  checkCancel,
  async (req, res) => {
    const { status, weight } = req.body;
    const id = req.params.orderId;
    const order = req.order;
    let query;
    const values = [];
    let message;
    if (order.status === 'created' && status === 'received' && weight) {
      // update parcel weight calculate the price and send a mail  to client
      const price = weight * 4000;
      query = queryUpdateWeight;
      values.push(weight);
      values.push(status);
      values.push(price);
      values.push(id);
      message =
        'We have recieved your order , please checkout the invoice sent via mail';
    } else {
      query = queryUpdateStatus;
      message = `delivery order status has been changed to ${status}`;
      values.push(status);
      values.push(id);
    }

    await Order.queryDb(query, values)
      .then((result) => {
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

router.put(
  '/:orderId/presentLocation',
  checkIsAdmin,
  celebrate({ body: updateLocation }),
  getOrder,
  checkCancel,
  async (req, res) => {
    const order = req.order;
    const { location } = req.body;
    const id = req.params.orderId;
    let query;
    const values = [];
    let message;
    if (order.destination === location) {
      // if present location is delivered update and set values to delivered
      query = queryUpdateDeliver;
      values.push(id);
      values.push(location);
      message = 'The order has been delivered';
    } else {
      query = queryUpdateLocation;
      values.push(location);
      values.push(id);
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
export default router;
