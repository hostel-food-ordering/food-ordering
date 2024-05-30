import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Shop, { ShopType } from "../models/shop";
import verifyToken from "./auth";
import User, { UserType } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      shop: ShopType;
      user: UserType;
      shopId: string;
    }
  }
}

const isOwner = [
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.shopId = req.params.shop_id || req.body.shop_id;

      if (!mongoose.Types.ObjectId.isValid(req.shopId)) {
        return res.status(400).send({ message: "Invalid shop ID" });
      }

      const user = await User.findById(req.userId);
      if (user) {
        if (user.isAdmin) {
          req.user = user;
          return next();
        }
      } else {
        res.cookie("auth_token", "", {
          expires: new Date(0),
        });
        return res
          .status(404)
          .send({ message: "Forced Logout: User Not Found" });
      }

      const shop = await Shop.findById(req.shopId);
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
