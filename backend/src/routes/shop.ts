import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Shop, { ShopType } from "../models/shop";
import mongoose from "mongoose";
import isOwner from "../middleware/shopOwner";

const shop = Router();

shop.post(
  "/",
  [
    check("name", "Name is required").isString().notEmpty(),
    check("location", "Location is required").isString().notEmpty(),
    check("email", "E-Mail is required").isString().isEmail(),
    check("phone", "Phone number is required")
      .isInt()
      .isLength({ min: 10, max: 10 })
      .notEmpty(),
    check("openingTime", "Opening time is required").isString().notEmpty(),
    // todo: add a check for ownerId
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      let shop = await Shop.findOne({
        email: req.body.email,
      });

      if (shop) {
        return res.status(409).send({
          message: "Email is already registered",
        });
      }

      shop = new Shop(req.body);
      await shop.save();

      return res.status(200).send({
        message: "Shop created successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

shop.delete(
  "/delete/:shop_id",
  [
    check("shop_id", "Invalid shop ID").custom((value) =>
      mongoose.Types.ObjectId.isValid(value)
    ),
    isOwner,
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array });
    }

    try {
      let shop = await Shop.findOne({
        shop_id: req.params.shop_id,
      });

      if (!shop) {
        return res.status(404).send({
          message: "Shop not found",
        });
      }

      await shop.deleteOne();
      return res.status(200).send({
        message: "Shop deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

shop.patch(
  "/patch/:shop_id",
  [
    check("shop_id", "Invalid shop ID").custom((value) =>
      mongoose.Types.ObjectId.isValid(value)
    ),
    check("name", "Name must be a string").optional().isString(),
    check("location", "Location must be a string").optional().isString(),
    check("email", "Email must be valid").optional().isEmail(),
    check("phone", "Phone number must be an integer of length 10")
      .optional()
      .isInt()
      .isLength({ min: 10, max: 10 }),
    check("openingTime", "Opening time must be a string").optional().isString(),
    isOwner,
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array });
    }

    try {
      let shop = await Shop.findOne({
        shop_id: req.params.shop_id,
      });

      if (!shop) {
        return res.status(404).send({
          message: "Shop not found",
        });
      }

      const updates = req.body as Partial<ShopType>;

      Object.entries(updates).forEach(([key, value]) => {
        if (key in shop) {
          (shop as any)[key] = value;
        }
      });
      await shop.save();
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

export default shop;
