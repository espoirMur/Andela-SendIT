/* eslint-disable arrow-parens */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/no-cycle */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-else-return */
import { Router } from 'express';
import { celebrate } from 'celebrate';
import { Order } from '../../models/orders';
import { checkIsAdmin } from '../../middlewares/authentification';
import { error5OOHandler } from '../../middlewares/errors';
import { decodeToken } from '../../utils/authentification';
import { createOrder } from '../../models/orderSchemas';
import { queryGetAll } from '../../models/orderQueries';
import { getOrder } from '../../middlewares/getOrder';

const orderRouter = Router();

orderRouter.get('/', checkIsAdmin, async (req, res) => {
  await Order.queryDb(queryGetAll)
    .then((results) => {
      return res.status(200).json(results.rows);
    })
    .catch((error) => error5OOHandler(error, res, req));
});

orderRouter.post('/', celebrate({ body: createOrder }), async (req, res) => {
  const contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0) {
    return res.status(406).send({
      success: false,
      message: 'Invalid content type',
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
    orderDetails.comments,
  );

  await order
    .save()
    .then((result) => {
      res.status(201).send({
        success: true,
        message: 'Delivery order successfully created!',
        order: result,
      });
    })
    .catch((error) => error5OOHandler(error, res, req));
});

orderRouter.get('/:orderId', checkIsAdmin, getOrder, async (req, res) => {
  return res.status(200).send({
    success: true,
    message: 'Delivery order  retrieved successfully',
    order: req.order,
  });
});

export default orderRouter;
