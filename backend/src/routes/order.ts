import { Router, Request, Response } from "express";
import Shop from "../../models/shop";
import Order from "../../models/order";
import mongoose from "mongoose";

const router = Router();

router.post("/order", async (req: Request, res: Response) => {
  const { shop_id, user_id, items } = req.body;

  try {
    const shop = Shop.findOne({ _id: shop_id });
    if (!shop) {
      return res.status(404).send({ message: "Shop not found" });
    }
    // const user = .findOne({ _id: user_id });
    // if (!user) {
    //   return res.status(404).send({ message: "User not found" });
    // }

    const newOrder = new Order({
      shop: shop_id,
      user: user_id,
      items: items,
      status: "PREPARING",
    });

    shop.

    await newOrder.save();

    return res.status(200).send({ message: "Order placed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong!" });
  }
});

export default router;
