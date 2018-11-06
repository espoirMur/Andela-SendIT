import { Router } from 'express';
import { allOrders } from '../models/orders';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json([...allOrders]);
});

export default router;
