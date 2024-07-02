import { Router, Request, Response } from "express";
import isOwner from "../middleware/shopOwner";
import { body, check, param, validationResult } from "express-validator";
import { isItemType } from "../utils/checkItem";
import Item from "../models/item";
import mongoose from "mongoose";
import { githubUpload, uploadMulter } from "../utils/fileUpload";
import { returnValidation } from "../utils/validation";

const item = Router();

item.post(
  "/add",
  uploadMulter.single("image"),
  isOwner,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("isVegetarian")
      .isBoolean()
      .withMessage("isVegetarian must be a boolean value"),
  ],
  returnValidation,
  async (req: Request, res: Response) => {
    try {
      const image_url = await githubUpload(req.shopId, req.file, "item");

      const item = new Item({
        name: req.body.name,
        price: req.body.price,
        image_url: image_url,
        category: req.body.category,
        isVegetarian: req.body.isVegetarian,
        shop: req.shopId,
      });
      await item.save();

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
  isOwner,
  [
    check("item", "Wrong Item")
      .exists()
      .custom((value) => isItemType(value)),
    param("item_id", "Invalid Item ID")
      .exists()
      .custom((value) => mongoose.Types.ObjectId.isValid(value)),
  ],
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
  isOwner,
  [
    param("item_id", "Invalid Item ID")
      .exists()
      .custom((value) => mongoose.Types.ObjectId.isValid(value)),
  ],
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
