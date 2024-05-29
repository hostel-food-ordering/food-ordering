import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const auth = Router();

auth.post(
  "/login",
  [
    check("email", "Email in required").isEmail(),
    check("password", "Password with 8 to 16 characters is required").isLength({
      min: 8,
      max: 16,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).send({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Invalid Credentials" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      res.status(200).send({ userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

auth.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

auth.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });

  res.status(200).send({ message: "Signed out successfully" });
});

export default auth;
