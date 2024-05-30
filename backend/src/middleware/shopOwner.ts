import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Shop from "../models/shop";
import verifyToken from "./auth";

const isOwner = [
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shopId = req.params.shop_id;
      const userId = req.userId;

      if (!mongoose.Types.ObjectId.isValid(shopId)) {
        return res.status(400).send({ message: "Invalid shop ID" });
      }

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).send({ message: "Shop not found" });
      }

      const isOwner = shop.ownerId.some(
        (ownerId) => ownerId.toString() === userId
      );
      if (!isOwner) {
        return res.status(403).send({
          message: "You do not have permission to perform this action",
        });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  },
];

export default isOwner;
