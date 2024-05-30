import { NextFunction, Request, Response } from "express";
import verifyToken from "./auth";
import User from "../models/user";

const isAdmin = [
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId);
      if (!(user && user.isAdmin)) {
        return res.status(401).send({ message: "No Admin rights" });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Something went wrong" });
    }
  },
];

export default isAdmin;
