/* eslint-disable no-underscore-dangle */
/* eslint-disable no-else-return */
import { Router } from 'express';
import {
  queryGetAllOrderUser,
  queryGetOneOrderUSer,
} from '../models/orderQueries';
import { Order } from '../models/orders';

const userOrdersRouter = Router();

userOrdersRouter.get('/:userId/parcels', async (req, res) => {
  const { user } = req;
  await Order.queryDb(queryGetAllOrderUser, [user.id])
    .then((results) => {
      return res.status(200).send({
        success: true,
        message: 'user delivery orders retrieved successfully',
        orders: results.rows,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: 'something went wong please try again',
      });
    });
});

userOrdersRouter.get('/:userId/parcels/:orderId', async (req, res) => {
  const { userId, orderId } = req.params;
  await Order.queryDb(queryGetOneOrderUSer, [orderId, userId])
    .then((results) => {
      if (!results.rows.length) {
        return res.status(404).send({
          success: false,
          message: 'the delivery order you are looking for does not exist',
        });
      } else {
        return res.status(200).send({
          success: true,
          message: 'user delivery orders retrieved successfully',
          order: results.rows[0],
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

export default userOrdersRouter;
