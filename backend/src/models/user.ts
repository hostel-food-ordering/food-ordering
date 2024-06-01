import mongoose from "mongoose";
import { CartItemType, cartItemSchema } from "./item";
import bcrypt from "bcryptjs";
import { OrderType } from "./order";
import { ShopType } from "./shop";

export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  cart: CartItemType[];
  orderHistory: OrderType[];
  ownedShop: ShopType[];
} & mongoose.Document;

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
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

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.fullName = this.firstName + " " + this.lastName;
  delete user.password;
  return user;
};

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
