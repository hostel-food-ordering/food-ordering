import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Shop, { ShopType } from "../models/shop";
import verifyToken from "./auth";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      shop: ShopType;
    }
  }
}

const isOwner = [
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.shop_id)) {
        return res.status(400).send({ message: "Invalid shop ID" });
      }

      const user = await User.findById(req.userId);
      if (user && user.isAdmin) {
        return next();
      }

      const shop = await Shop.findById(req.params.shop_id);
      if (!shop) {
        return res.status(404).send({ message: "Shop not found" });
      }

      const isOwner = shop.ownerId.some(
        (ownerId) => ownerId.toString() === req.userId
      );

      if (!isOwner) {
        return res.status(403).send({
          message: "You do not have permission to perform this action",
        });
      }

      req.shop = shop;
      return next();
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Something went wrong" });
    }
  },
];

export default isOwner;
