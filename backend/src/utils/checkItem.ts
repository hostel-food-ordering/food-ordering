import mongoose from "mongoose";
import { ItemType } from "../models/item";

export function isItemType(item: any): item is ItemType {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.image_url === "string" &&
    typeof item.isVegetarian === "boolean" &&
    mongoose.Types.ObjectId.isValid(item.shop)
  );
}

export function isItemTypeArray(itemArray: any): itemArray is ItemType[] {
  if (!Array.isArray(itemArray)) {
    return false;
  }

  for (const item of itemArray) {
    if (
      !(
        typeof item === "object" &&
        item !== null &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.image_url === "string" &&
        typeof item.isVegetarian === "boolean" &&
        mongoose.Types.ObjectId.isValid(item.shop)
      )
    ) {
      return false;
    }
  }
  return true;
}
