import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Shop from "../models/shop";
import mongoose from "mongoose";
import isOwner from "../middleware/shopOwner";
import isAdmin from "../middleware/checkAdmin";
import User from "../models/user";
import verifyToken from "../middleware/auth";

const shop = Router();

shop.get("", async (req: Request, res: Response) => {
  try {
    const shops = await Shop.find();
    res.status(200).send({ shops });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

shop.get("/my_shops", verifyToken, async (req: Request, res: Response) => {
  try {
    const ownedShops = await Shop.find({ ownerId: req.userId }).select(
      "-_id -items -ownerId"
    );
    res.status(200).send({ ownedShops });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

shop.post(
  "/register",
  isAdmin,
  [
    check("name", "Name is required").isString().notEmpty(),
    check("location", "Location is required").isString().notEmpty(),
    check("email", "E-Mail is required").isString().isEmail(),
    check("phone", "Phone number is required")
      .isInt()
      .isLength({ min: 10, max: 10 })
      .notEmpty(),
    check("openingTime", "Opening time is required").isString().notEmpty(),
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

      // fetch userId associated with provided email
      let user = await User.findOne({
        email: req.body.email,
      });

      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      shop = new Shop({
        ...req.body,
        ownerId: [user._id],
      });

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
  isAdmin,
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
  "/update/:shop_id",
  isOwner,
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
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array });
    }

    try {
      const modificationKeys = [
        "name",
        "location",
        "image_url",
        "phone",
        "isOpen",
        "openingTime",
      ];

      const shop = req.shop;

      for (const key of modificationKeys) {
        if (req.body.item[key]) {
          (shop as any)[key] = req.body.item[key];
        }
      }

      await shop.save();

      return res.status(200).send({
        message: "Shop details updated successfully",
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
  "/add_owner/:shop_id",
  isAdmin,
  [check("email", "Email is required").isString().notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        message: errors.array,
      });
    }

    try {
      // check if shop exists
      const shop = await Shop.findOne({
        shop_id: req.params.shop_id,
      });
      if (!shop) {
        return res.status(404).send({
          message: "Shop not found",
        });
      }

      // check if user exists
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      // check if user is already an owner
      if (shop.ownerId.includes(user._id as mongoose.Types.ObjectId)) {
        return res.status(400).send({
          message: "User is already an owner",
        });
      }

      shop.ownerId.push(user._id as mongoose.Types.ObjectId);
      await shop.save();
      return res.status(200).send({
        message: "New owner added successfully",
        shop,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

shop.patch(
  "/remove_owner/:shop_id",
  isAdmin,
  [check("email", "Email is required").isString().notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        message: errors.array,
      });
    }

    try {
      // check if shop exists
      const shop = await Shop.findOne({
        shop_id: req.params.shop_id,
      });
      if (!shop) {
        return res.status(404).send({
          message: "Shop not found",
        });
      }

      // check if user exists
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }
      const index = shop.ownerId.findIndex((id) =>
        id.equals(user._id as mongoose.Types.ObjectId)
      );

      // check if user is an owner
      if (index === -1) {
        return res.status(400).send({
          message: "User is not an owner of the shop",
        });
      }
      shop.ownerId.splice(index, 1);
      await shop.save();

      await shop.save();
      return res.status(200).send({
        message: "Removed owner successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

export default shop;
