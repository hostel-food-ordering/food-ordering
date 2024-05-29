import mongoose from "mongoose";
import { CartItemType, cartItemSchema } from "./item";
import { ShopType } from "./shop";
import { OrderType } from "./order";

export type UserType = {
  firstName: string;
  lastName: string;
  password: string;
  ownedStore: ShopType[];
  cart: CartItemType[];
  orderHistory: OrderType[];
};

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  cart: {
    type: [{ type: cartItemSchema }],
  },
});

userSchema.virtual("orderHistory", {
  ref: "Order",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("ownedShop", {
  ref: "Shop",
  localField: "_id",
  foreignField: "ownerId",
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", userSchema);

export default User;
