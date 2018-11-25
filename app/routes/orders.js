/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/no-cycle */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-else-return */
import { Router } from 'express';
import { celebrate } from 'celebrate';
import { orders, Order } from '../models/orders';
import { checkIsAdmin } from '../middlewares/authentification';
import { decodeToken } from '../utils/authentification';
import { createOrder } from '../models/orderSchemas';
import { queryCreate, queryGetAll, queryGetId } from '../models/orderQueries';

const router = Router();

router.get('/', checkIsAdmin, async (req, res) => {
  await Order.queryDb(queryGetAll)
    .then((results) => {
      return res.status(200).json(results);
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
    orderDetails.comments
  );
  const values = Object.values([
    order.origin,
    order.destination,
    order.recipientPhone,
    order.initiatorId,
    order.comments,
  ]);
  console.log(values, 'vs orders', order, orderDetails.comments);
  await Order.queryDb(queryCreate, values)
    .then((result) => {
      res.status(201).send({
        success: true,
        message: 'delivery order successfully created!',
        order: result[0],
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

router.get('/:id', checkIsAdmin, async (req, res) => {
  const id = req.params.id;

  await Order.queryDb(queryGetId, [id]).then((results) => {
    if (results.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'the delivery order you are looking for does not exist',
      });
    } else {
      return res.status(200).send({
        success: true,
        message: 'delivery order  retrieved successfully',
        order: results[0],
      });
    }
  });
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
      return res.status(403).send({
        success: false,
        message:
          'cannot change the present location or status  of  a delivered order',
      });
    }
  } else {
    return res.status(404).send({
      success: false,
      message: 'the delivery order you are looking for  does not exist',
    });
  }
});

export default router;
