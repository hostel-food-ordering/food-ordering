import mongoose from "mongoose";
import { CartItemType, cartItemSchema } from "./item";
import bcrypt from "bcryptjs";

export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cart: CartItemType[];
};

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
