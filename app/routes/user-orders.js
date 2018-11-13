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
    });
  } else {
    return res.status(404).send({
      success: false,
      message: `user with  id ${id} does not exist`,
    });
  }
});

export default userOrdersRouter;
