import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).send({ message: "unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;

    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      res.cookie("auth_token", "", {
        expires: new Date(0),
      });
      return res.status(404).send({ message: "Forced Logout: User Not Found" });
    }

    next();
  } catch (error) {
    return res.status(401).send({ message: "unauthorized" });
  }
};

export default verifyToken;
