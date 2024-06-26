import mongoose from "mongoose";
import { ShopType } from "./shop";

export type ItemType = {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image_url: string;
  category: string;
  isVegetarian: boolean;
  shop: mongoose.Types.ObjectId;
} & mongoose.Document;

export const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image_url: { type: String },
  category: { type: String, required: true },
  isVegetarian: { type: Boolean, default: false },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
});

export type CartItemType = {
  item: mongoose.Types.ObjectId | ItemType;
  quantity: number;
} & mongoose.Document;

export const cartItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const Item = mongoose.model<ItemType>("Item", itemSchema);

export default Item;
