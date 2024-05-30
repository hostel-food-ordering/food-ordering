import { Router, Request, Response } from "express";
import isOwner from "../middleware/shopOwner";
import { check, param, validationResult } from "express-validator";
import { isItemType, isItemTypeArray } from "../utils/checkItem";
import Item, { ItemType } from "../models/item";
import mongoose from "mongoose";

const item = Router();

item.post(
  "/add:shop_id",
  isOwner,
  [check("items", "Items missing").exists().isArray()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array() });
    }

    try {
      if (!isItemTypeArray(req.body.items)) {
        return res.status(400).send({ message: "Wrong Item Type" });
      }

      req.body.items.forEach((item: ItemType) => {
        item.shop = new mongoose.Types.ObjectId(req.params.shop_id);
      });

      await Item.insertMany(req.body.items);

      return res.status(200).send({ message: "Items Added Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

item.patch(
  "/update/:item_id",
  [
    check("item", "Wrong Item")
      .exists()
      .custom((value) => isItemType(value)),
    param("item_id", "Invalid Item ID")
      .exists()
      .custom((value) => mongoose.Types.ObjectId.isValid(value)),
  ],
  isOwner,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array() });
    }

    try {
      const modificationKeys = [
        "name",
        "price",
        "image_url",
        "catergory",
        "isVegetarian",
      ];

      const item = await Item.findById(req.params.item_id);
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      console.log(item.shop, req.shopId);
      if (
        String(item._id) !== req.params.item_id ||
        String(item.shop) !== req.shopId
      ) {
        return res
          .status(500)
          .send({ message: "Item doesn't belong to this shop" });
      }

      for (const key of modificationKeys) {
        if (req.body.item[key]) {
          (item as any)[key] = req.body.item[key];
        }
      }

      await item.save();

      return res.status(200).send({ message: "Items Updated Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

item.delete(
  "/delete/:item_id",
  [
    param("item_id", "Invalid Item ID")
      .exists()
      .custom((value) => mongoose.Types.ObjectId.isValid(value)),
  ],
  isOwner,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array() });
    }

    try {
      const item = await Item.findById(req.params.item_id);
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      if (String(item.shop) !== req.shopId) {
        return res
          .status(400)
          .send({ message: "Item doesn't belong to this shop" });
      }
      await item.deleteOne();

      return res.status(200).send({ message: "Items Updated Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

export default item;
