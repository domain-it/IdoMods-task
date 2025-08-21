import express from 'express';
import { exportOrdersCsv } from '../controllers/order.js';

const ordersRouter = express.Router();

ordersRouter.get('/export', exportOrdersCsv);

export default ordersRouter;
