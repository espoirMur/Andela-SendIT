/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-else-return */
import { Router } from 'express';
import { users } from '../models/user';

const userOrdersRouter = Router();

userOrdersRouter.get('/:id/parcels', (req, res) => {
  const id = req.params.id;
  const user = users.get(id.toString());
  if (user) {
    const orders = user.orders;
    return res.status(200).send({
      success: true,
      message: 'user delivery orders  retrieved successfully',
      orders,
      user,
    });
  } else {
    return res.status(404).send({
      success: false,
      message: `user with  id ${id} does not exist`,
    });
  }
});

userOrdersRouter.get('/:userId/parcels/:orderId', (req, res) => {
  const userId = req.params.userId;
  const orderId = req.params.orderId;
  const user = users.get(userId.toString());
  if (user) {
    let order = user.orders.get(orderId);
    if (order) {
      order = order.toJSON();
      return res.status(200).send({
        success: true,
        message: 'user delivery order retrieved successfully',
        order,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: `order with  id ${orderId} does not exist`,
      });
    }
  } else {
    return res.status(404).send({
      success: false,
      message: `user with id ${userId} cannot be found`,
    });
  }
});

userOrdersRouter.put('/:userId/parcels/:orderId/cancel', (req, res) => {
  const userId = req.params.userId;
  const orderId = req.params.orderId;
  const user = users.get(userId);
  if (user) {
    const order = user.orders.get(orderId);
    if (order) {
      if (order.status !== 'delivered') {
        order.status = 'canceled';
        return res.status(200).send({
          success: true,
          message: 'delivery order has been canceled',
        });
      } else {
        return res.status(401).send({
          success: false,
          message: 'cannot cancel a delivered order',
        });
      }
    } else {
      return res.status(404).send({
        success: false,
        message: `delivery order with id ${orderId} does not exist`,
      });
    }
  } else {
    return res.status(404).send({
      success: false,
      message: `user with id ${userId} cannot be found`,
    });
  }
});

userOrdersRouter.put('/:userId/parcels/:orderId', (req, res) => {
  const userId = req.params.userId;
  const orderId = req.params.orderId;
  const user = users.get(userId);
  const newDestination = req.body.destination;

  if (user) {
    const order = user.orders.get(orderId);
    if (order) {
      if (order.status !== 'delivered') {
        if (newDestination) {
          order.destination = newDestination;
          return res.status(200).send({
            success: true,
            message: 'delivery order  destination has been changed',
          });
        } else {
          return res.status(400).send({
            success: false,
            message: 'new destination is required',
          });
        }
      } else {
        return res.status(401).send({
          success: false,
          message: 'cannot change the destination of  a delivered order',
        });
      }
    } else {
      return res.status(404).send({
        success: false,
        message: `delivery order with id ${orderId} does not exist`,
      });
    }
  } else {
    return res.status(404).send({
      success: false,
      message: `user with id ${userId} cannot be found`,
    });
  }
});

export default userOrdersRouter;
