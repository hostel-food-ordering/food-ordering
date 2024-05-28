import mongoose from "mongoose";
import { CartItemType, cartItemSchema } from "./item";

export type OrderType = {
  shop: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  items: CartItemType[];
  status: "PREPARING" | "DELIVERED" | "CANCELLED  ";
};

const orderSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, requied: true },
  items: {
    type: [{ type: cartItemSchema, required: true }],
    validate: {
      validator: function (items: any[]) {
        return items.length > 0;
      },
      message: "Order must contain at least one item",
    },
  },
  status: { type: String, required: true },
  creationTime: { type: Date, default: Date.now() },
});

const Order = mongoose.model<OrderType>("Order", orderSchema);

export default Order;
