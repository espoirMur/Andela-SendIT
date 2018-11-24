/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-else-return */
import { Router } from 'express';
import bodyParser from 'body-parser';
import { orders, Order } from '../models/orders';
import { checkIsAdmin } from '../middlewares/authentification';
import { decodeToken } from '../utils/authentification';

const router = Router();

router.get('/', checkIsAdmin, (req, res) => {
  const allOders = Order.OrderMapToJson(orders);
  res.status(200).json(allOders);
});

router.post('/', (req, res) => {
  const contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0) {
    return res.status(406).send({
      success: false,
      message: 'invalid content type',
    });
  } else if (!req.body.origin) {
    return res.status(400).send({
      success: false,
      message: 'pickup location is required',
    });
  } else if (!req.body.destination) {
    return res.status(400).send({
      success: false,
      message: 'destination is required',
    });
  } else if (!req.body.recipientPhone) {
    return res.status(400).send({
      success: false,
      message: 'recipient phone is required',
    });
  }
  const orderDetails = req.body;
  const header = req.headers.authorization;
  const token = header.slice(7);
  const payload = decodeToken(token);
  const initiatorId = payload.sub;
  const order = new Order(
    orderDetails.origin,
    orderDetails.destination,
    orderDetails.recipientPhone,
    initiatorId,
    orderDetails.comment
  );
  order.save();
  return res.status(201).send({
    success: true,
    message: 'delivery order successfully created!',
    orderId: order.id,
  });
});

router.get('/:id', checkIsAdmin, (req, res) => {
  const id = req.params.id;
  const order = orders.get(id);
  if (order) {
    return res.status(200).send({
      success: true,
      message: 'delivery order  retrieved successfully',
      order,
    });
  } else {
    return res.status(404).send({
      success: false,
      message: `delivery order with id ${id} does not exist`,
    });
  }
});

router.put('/:id/cancel', checkIsAdmin, (req, res) => {
  const id = req.params.id;
  const order = orders.get(id);
  if (order) {
    if (order.status !== 'delivered') {
      if (order.status === 'canceled') {
        return res.status(401).send({
          success: false,
          message: 'order has already been canceled',
        });
      } else {
        order.status = 'canceled';
        return res.status(200).send({
          success: true,
          message: 'delivery order has been canceled',
        });
      }
    } else {
      return res.status(401).send({
        success: false,
        message: 'cannot cancel a delivered order',
      });
    }
  } else {
    return res.status(404).send({
      success: false,
      message: `delivery order with id ${id} does not exist`,
    });
  }
});

router.put('/:id', checkIsAdmin, (req, res) => {
  const id = req.params.id;
  const order = orders.get(id);
  const presentLocation = req.body.presentLocation;
  const status = req.body.status;
  console.log(status, '====', presentLocation);
  if (order) {
    if (order.status !== 'delivered') {
      if (
        typeof status === 'undefined' &&
        typeof presentLocation === 'undefined'
      ) {
        return res.status(400).send({
          success: false,
          message: 'either present location or status is required',
        });
      } else if (status && typeof presentLocation === 'undefined') {
        order.status = status;
        if (status === 'delivered') {
          order.deliveryDate = new Date().toJSON();
        }
        return res.status(200).send({
          success: true,
          message: 'delivery order status has been changed',
          order,
        });
      } else if (presentLocation && typeof status === 'undefined') {
        order.presentLocation = presentLocation;
        return res.status(200).send({
          success: true,
          message: 'delivery order  present location has been changed',
          order,
        });
      } else if (presentLocation && status) {
        order.status = status;
        order.presentLocation = presentLocation;
        return res.status(200).send({
          success: true,
          message: 'order status and present location have been changed',
          order,
        });
      }
    } else {
      return res.status(401).send({
        success: false,
        message:
          'cannot change the present location or status  of  a delivered order',
      });
    }
  } else {
    return res.status(404).send({
      success: false,
      message: `delivery order with id ${id} does not exist`,
    });
  }
});

export default router;
