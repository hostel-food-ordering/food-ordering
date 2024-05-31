import mongoose from "mongoose";
import { CartItemType } from "../models/item";
import { isItemType } from "./checkItem";

export function isCartItemType(cart: any): cart is CartItemType {
  console.log(cart.item.shop);
  return (
    typeof cart === "object" &&
    cart !== null &&
    ((typeof cart.item === "string" &&
      mongoose.Types.ObjectId.isValid(cart.item)) ||
      isItemType(cart.item)) &&
    typeof cart.quantity === "number"
  );
}

export function isCartItemTypeArray(
  cartArray: any
): cartArray is CartItemType[] {
  if (!Array.isArray(cartArray)) {
    return false;
  }

  for (const cart of cartArray) {
    if (
      !(
        typeof cart === "object" &&
        cart !== null &&
        ((typeof cart.item === "string" &&
          mongoose.Types.ObjectId.isValid(cart.item)) ||
          isItemType(cart.item)) &&
        typeof cart.quantity === "number"
      )
    ) {
      return false;
    }
  }
  return true;
}
