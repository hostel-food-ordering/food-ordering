import mongoose from "mongoose";
import { ShopType } from "./shop";

export type ItemType = {
  name: string;
  price: number;
  image_url: string;
  shop: mongoose.Schema.Types.ObjectId | ShopType;
};

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image_url: { type: String },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
