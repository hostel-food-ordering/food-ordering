import { Router, Request, Response } from "express";
import { check, oneOf, param, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/user";
import verifyToken from "../middleware/auth";
import { isCartItemTypeArray } from "../utils/checkCart";
import mongoose from "mongoose";
import Item, { CartItemType, ItemType } from "../models/item";
import Order, { OrderCartItemType } from "../models/order";
import Shop from "../models/shop";

const user = Router();

user.get("/profile", verifyToken, async (req: Request, res: Response) => {
  try {
    let user = await User.findById(req.userId);
    if (!user) {
      res.cookie("auth_token", "", {
        expires: new Date(0),
      });
      return res.status(404).send({ message: "Forced Logout: User Not Found" });
    }

    if (user.isAdmin === true) {
      const allShops = await Shop.find();
      user.ownedShop = allShops;
    } else {
      user = await user.populate("ownedShop");
    }

    return res.status(200).send({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});

user.get("/cart", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "cart.item",
      populate: {
        path: "shop",
      },
    });
    if (!user) {
      res.cookie("auth_token", "", {
        expires: new Date(0),
      });
      return res.status(404).send({ message: "Forced Logout: User Not Found" });
    }

    return res.status(200).send({ cart: user.cart });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});

user.post("/local-cart", async (req: Request, res: Response) => {
  try {
    const { cart } = req.body;
    const ids = Object.keys(cart).map((id) => id);
    if (ids.length == 0) {
      return res.status(200).send({ cart: [] });
    }
    const items = await Item.find({ _id: { $in: ids } }).populate(
      "shop",
      "name isOpen"
    );
    const itemsWithQuantities = items.map((item) => ({
      item: item,
      quantity: cart[item._id.toString()],
    }));

    return res.status(200).send({ cart: itemsWithQuantities });
  } catch (error) {
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});

user.post(
  "/register",
  [
    check("firstName", "First name is required and must be a string")
      .isString()
      .isLength({ min: 2, max: 10 }),
    check("lastName", "Last name is required")
      .isString()
      .isLength({ min: 2, max: 10 }),
    check("email", "Email is required").isEmail().notEmpty(),
    check(
      "password",
      "Password is required and must be between 8 and 16 characters"
    )
      .isString()
      .isLength({ min: 8, max: 16 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array() });
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });
      if (user) {
        return res.status(400).send({ message: "User already exists" });
      }

      req.body.isAdmin = false;
      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      res.status(200).send({ message: "User registered successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

user.patch(
  "/update",
  verifyToken,
  oneOf([
    check("firstName").exists().isString().isLength({ min: 2 }),
    check("lastName").exists().isString().isLength({ min: 2 }),
    check("password").exists().isString().isLength({ min: 8, max: 16 }),
  ]),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array() });
    }

    const { firstName, lastName, password } = req.body;
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (password) user.password = password;

      await user.save();

      return res.status(200).send({
        message: `User fields updated: ${
          (firstName ? "first name " : "") +
          (lastName ? "last name " : "") +
          (password ? "password" : "")
        }`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

user.post(
  "/cart/update",
  verifyToken,
  [check("cart").exists().isArray()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array() });
    }

    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      if (!isCartItemTypeArray(req.body.cart)) {
        return res.status(400).send({ message: "Wrong Cart" });
      }

      user.cart = req.body.cart;
      await user.save();

      res.status(200).send({ message: "Cart Updated Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

user.get("/order", verifyToken, async (req: Request, res: Response) => {
  try {
    const { order_id } = req.query;

    const user = await User.findById(req.userId).populate("orderHistory");
    if (!user) {
      res.cookie("auth_token", "", {
        expires: new Date(0),
      });
      return res.status(404).send({ message: "Forced Logout: User Not Found" });
    }

    if (order_id) {
      const order = user.orderHistory.find((order) => order._id);
      if (!order) {
        return res.status(404).send({ message: "No Such Order Found" });
      }
      return res.status(200).send(order);
    }

    const removalKeys: string[] = ["cartItems"];
    const order = user.orderHistory;
    order.forEach((order) => {
      removalKeys.forEach((key) => {
        (order as any)[key] = undefined;
      });
    });

    return res.status(200).send({ orderHistory: order });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});

user.post(
  "/place-order/:shop_id",
  verifyToken,
  [
    param("shop_id", "Shop id Invalid").custom((value) =>
      mongoose.Types.ObjectId.isValid(value)
    ),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array() });
    }

    try {
      const user = await User.findById(req.userId).populate("cart.item");
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const orderCart: OrderCartItemType[] = [];
      user.cart.forEach((cartItem: CartItemType) => {
        if (String((cartItem.item as ItemType).shop) === req.params.shop_id) {
          orderCart.push(cartItem as OrderCartItemType);
        }
      });

      if (orderCart.length === 0) {
        return res
          .status(400)
          .send({ message: "No item in your cart from this shop" });
      }

      const newOrder = new Order({
        shop: req.params.shop_id,
        user: req.userId,
        orderValue: orderCart.reduce(
          (sum, orderCart) => sum + orderCart.item.price * orderCart.quantity,
          0
        ),
        cartItems: orderCart,
      });

      user.cart = user.cart.filter((cartItem: CartItemType) => {
        return !(
          String((cartItem.item as ItemType).shop) === req.params.shop_id
        );
      });

      await user.save();
      await newOrder.save();

      return res.status(200).send({ message: "Order Placed Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

export default user;
