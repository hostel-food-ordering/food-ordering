import { Router, Request, Response } from "express";
import { check, oneOf, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/user";
import verifyToken from "../middleware/auth";
import { isCartItemTypeArray } from "../utils/checkCart";

const user = Router();

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
  oneOf([
    check("firstName").exists().isString().isLength({ min: 2 }),
    check("lastName").exists().isString().isLength({ min: 2 }),
    check("password").exists().isString().isLength({ min: 8, max: 16 }),
  ]),
  verifyToken,
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

user.patch(
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

      console.log(req.body.cart);

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

export default user;
