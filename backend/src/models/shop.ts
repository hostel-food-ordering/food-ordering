import mongoose from "mongoose";

export type ShopType = {
  name: string;
  location: string;
  image_url: string;
  email: string;
  phone: number;
  isOpen: boolean;
  openingTime: string;
  ownerId: mongoose.Types.ObjectId[];
  items: mongoose.Types.ObjectId[];
  orderHistory: mongoose.Types.ObjectId[];
} & mongoose.Document;

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image_url: { type: String },
  email: {
    type: String,
    required: true,
  },
  phone: { type: Number, required: true },
  isOpen: { type: Boolean, default: false },
  openingTime: { type: String, required: true },
  ownerId: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    validate: {
      validator: (arr: mongoose.Types.ObjectId[]) => arr.length > 0,
      message: "Shop must have atleast one owner",
    },
  },
  items: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
});

shopSchema.virtual("orderHistory", {
  ref: "Order",
  localField: "_id",
  foreignField: "shop",
});

const Shop = mongoose.model<ShopType>("Shop", shopSchema);

export default Shop;
