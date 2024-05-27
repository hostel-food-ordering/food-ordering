import mongoose from "mongoose";

export type ShopType = {
  name: string;
  location: string;
  image_url?: string;
  ownerId?: mongoose.Types.ObjectId[];
  email: string;
  items?: mongoose.Types.ObjectId[];
};

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image_url: { type: String },
  ownerId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  email: { type: String, required: true },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});

const Shop = mongoose.model<ShopType>("Shop", shopSchema);

export default Shop;
