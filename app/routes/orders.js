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
import { createOrder } from '../models/orderSchemas';
import { queryGetAll, queryCancel } from '../models/orderQueries';
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
    orderDetails.comments
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

router.get('/:id', checkIsAdmin, getOrder, async (req, res) => {
  return res.status(200).send({
    success: true,
    message: 'delivery order  retrieved successfully',
    order: req.order,
  });
});

router.put('/:id/cancel', getOrder, checkCreator, checkCancel, (req, res) => {
  const id = req.params.id;
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
});
/*** 
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
**/
export default router;
