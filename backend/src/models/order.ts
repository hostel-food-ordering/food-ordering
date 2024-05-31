import mongoose from "mongoose";
import { itemSchema, ItemType } from "./item";

export type OrderCartItemType = {
  item: ItemType;
  quantity: number;
};

export type OrderType = {
  shop: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  status: "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED";
  creationTime: Date;
  orderValue: number;
  cartItems: OrderCartItemType[];
} & mongoose.Document;

const orderSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", requied: true },
  status: {
    type: String,
    enum: ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"],
    default: "PENDING",
    required: true,
  },
  creationTime: { type: Date, default: Date.now() },
  orderValue: {
    type: Number,
    required: true,
  },
  cartItems: {
    type: [{ item: itemSchema, quantity: { type: Number, required: true } }],
    validate: {
      validator: (arr: mongoose.Types.ObjectId[]) => arr.length > 0,
      message: "Order must contain at least one item",
    },
  },
});

const Order = mongoose.model<OrderType>("Order", orderSchema);

export default Order;
