/* eslint-disable no-underscore-dangle */
/* eslint-disable no-else-return */
import { Router } from 'express';
import bodyParser from 'body-parser';
import { allOrders, Order } from '../models/orders';
import { User } from '../models/user';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json([...allOrders]);
});

router.post('/', (req, res) => {
  const contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0) {
    return res.status(406).send({
      success: false,
      message: 'invalid content type',
    });
  } else if (!req.body._origin) {
    return res.status(400).send({
      success: false,
      message: 'pickup location is required',
    });
  } else if (!req.body._destination) {
    return res.status(400).send({
      success: false,
      message: 'destination is required',
    });
  } else if (!req.body._recipientPhone) {
    return res.status(400).send({
      success: false,
      message: 'recipient phone is required',
    });
  }
  const orderDetails = req.body;
  // should retrieve initiator by his id
  const initiator = new User('espoir', 'esp@fg.com', '25078000');
  const order = new Order(
    orderDetails._origin,
    orderDetails._destination,
    orderDetails._recipientPhone,
    initiator,
    orderDetails._comment,
  );
  allOrders.set(order.id, order);
  return res.status(201).send({
    success: true,
    message: 'delivery order successfully created!',
    orderId: order.id,
  });
});

export default router;
