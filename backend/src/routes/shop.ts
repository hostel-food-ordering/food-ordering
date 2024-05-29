import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Shop from "../models/shop";

const shop = Router();

// PATCH /api/shop/:shop_id
// DELETE /api/shop/:shop_id

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

export default shop;
