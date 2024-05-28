import mongoose from "mongoose";
import { ShopType } from "./shop";

export type ItemType = {
  name: string;
  price: number;
  image_url: string;
  category: string;
  isVegetarian: boolean;
  shop: mongoose.Schema.Types.ObjectId | ShopType;
};

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image_url: { type: String },
  category: { type: String, required: true },
  isVegetarian: { type: Boolean, default: false },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
});

export type CartItemType = {
  item: ItemType;
  quantity: number;
};

export const cartItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  quantity: { type: Number, required: true },
});

const Item = mongoose.model<ItemType>("Item", itemSchema);

export default Item;
