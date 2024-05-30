import { Router, Request, Response } from "express";
import isOwner from "../middleware/shopOwner";
import { check, validationResult } from "express-validator";
import { isItemTypeArray } from "../utils/checkItem";
import Item, { ItemType } from "../models/item";
import mongoose from "mongoose";

const item = Router();

item.post(
  "/add/:shop_id",
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

export default item;
