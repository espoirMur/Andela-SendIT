/* eslint-disable import/no-cycle */
/* eslint-disable arrow-parens */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-else-return */
import { Router } from 'express';
import {
  queryGetAllOrderUser,
  queryGetOneOrderUSer,
} from '../models/orderQueries';
import { Order } from '../models/orders';
import { error5OOHandler } from '../middlewares/errors';

const userOrdersRouter = Router();

userOrdersRouter.get('/:userId/parcels', async (req, res) => {
  const { user } = req;
  await Order.queryDb(queryGetAllOrderUser, [user.id])
    .then((results) => {
      return res.status(200).send({
        success: true,
        message: 'User delivery orders retrieved successfully',
        orders: results.rows,
      });
    })
    .catch((error) => error5OOHandler(error, res, req));
});

userOrdersRouter.get('/:userId/parcels/:orderId', async (req, res) => {
  const { userId, orderId } = req.params;
  await Order.queryDb(queryGetOneOrderUSer, [orderId, userId])
    .then((results) => {
      if (!results.rows.length) {
        return res.status(404).send({
          success: false,
          message: 'The delivery order you are looking for does not exist',
        });
      } else {
        return res.status(200).send({
          success: true,
          message: 'User delivery orders retrieved successfully',
          order: results.rows[0],
        });
      }
    })
    .catch((error) => error5OOHandler(error, res, req));
});

export default userOrdersRouter;
