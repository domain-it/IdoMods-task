import { AsyncParser } from '@json2csv/node';
import { Order } from '../model/order.js';
import type { Request, Response, NextFunction } from 'express';
import type { OrderFilter, PriceFilter } from '../types/database.types.js';
import { LogError, LogInfo } from '../utils/color-log.js';
import type { OrderAPI } from '../types/database.types.js';
import { validateExportOrdersQuery } from '../utils/validation.js';

const apiUrl: string =
  `${process.env.API_URL}/orders/orders?get=1` || 'http://localhost';
const apiKey: string | undefined = process.env.API_KEY;
const method = 'GET';
const headers = {
  accept: 'application/json',
  'Content-Type': 'application/json',
  'X-API-KEY': apiKey || '',
};

export const exportOrdersCsv = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { minWorth, maxWorth, orderId } = req.query;

    const validationResult = validateExportOrdersQuery(req.query);

    if (!validationResult.valid) {
      return res
        .status(403)
        .send({
          message: 'Export order failed',
          reason: validationResult.error,
        });
    }

    const priceFilter: PriceFilter = {};
    if (minWorth) priceFilter.$gte = Number(minWorth);
    if (maxWorth) priceFilter.$lte = Number(maxWorth);

    const filter: OrderFilter = {};
    if (minWorth || maxWorth) {
      filter.totalPrice = priceFilter;
    }

    if (orderId?.length) filter.orderId = orderId.toString();

    const orders = await Order.find(filter).lean();

    const fields = [
      { label: 'Order ID', value: 'orderId' },
      { label: 'Products', value: 'products' },
      { label: 'Total Price', value: 'totalPrice' },
      {
        label: 'Order Change Date',
        value: (row: { orderChangeDate: { toISOString: () => any } }) =>
          row.orderChangeDate ? row.orderChangeDate.toISOString() : '',
      },
    ];

    const asyncParser = new AsyncParser({ fields });

    const csv = asyncParser.parse(orders);
    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    csv.pipe(res);
    csv.on('error', (error) => next(error));
  } catch (error) {
    next(error);
  }
};

export const fetchOrdersFromApi = async () => {
  try {
    const response = await fetch(apiUrl, { method, headers });
    if (!response.ok) {
      LogError(`Service`, `${response.statusText}`);
    }
    LogInfo('Service', `Successfully fetching orders`);
    return response.json();
  } catch (error) {
    LogError('Service', `Error occurred when fetch orders: ${error}`);
  }
};

export async function periodicFetchAndSync() {
  try {
    LogInfo('Service', `Starting scheduled fetch and sync`);
    const data = (await fetchOrdersFromApi()) as OrderAPI;
    await fetchAndSyncOrders(data);
    LogInfo('Service', `Fetch and sync completed`);
  } catch (error) {
    LogError('Service', `Error occurred in scheduled fetch orders: ${error}`);
  }
}

export const fetchAndSyncOrders = async (ordersFromApi: OrderAPI) => {
  const results = ordersFromApi.Results;
  for (const apiOrder of results) {
    const filter = { orderId: apiOrder.orderId };
    const apiOrderChangeDate = new Date(apiOrder.orderDetails.orderChangeDate);

    const products = apiOrder.orderDetails.productsResults.map((product) => ({
      productId: product.productId,
      quantity: product.productQuantity,
      netPrice: product.productOrderPriceNet,
      vat: product.productVat,
    }));

    const totalNet = products.reduce(
      (sum, product) => sum + product.netPrice * product.quantity,
      0
    );
    const totalVat = products.reduce(
      (sum, product) =>
        (sum + (product.netPrice * product.vat) / 100) * product.quantity,
      0
    );
    const totalPrice = totalNet + totalVat;

    const existingOrder = await Order.findOne(filter);

    if (
      !existingOrder ||
      existingOrder.orderChangeDate < apiOrderChangeDate ||
      apiOrder.orderDetails.orderStatus === 'finished' ||
      apiOrder.orderDetails.orderStatus === 'lost' ||
      apiOrder.orderDetails.orderStatus === 'false'
    ) {
      await Order.findOneAndUpdate(
        filter,
        {
          $set: {
            orderChangeDate: apiOrderChangeDate,
            products,
            totalNet,
            totalVat,
            totalPrice,
          },
        },
        { upsert: true, new: true }
      );
    }
  }
};
