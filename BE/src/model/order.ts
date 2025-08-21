import mongoose, { Schema } from 'mongoose';
import type { OrderTable, Product } from '../types/database.types.js';

const ProductSchema = new Schema<Product>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  netPrice: { type: Number, required: true },
  vat: { type: Number, required: true },
});

const OrderSchema = new Schema<OrderTable>({
  orderId: { type: String, required: true },
  orderChangeDate: { type: Date, required: true },
  products: { type: [ProductSchema], required: true },
  totalNet: { type: Number, required: true },
  totalVat: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

export const Order = mongoose.model<OrderTable>('Order', OrderSchema);
