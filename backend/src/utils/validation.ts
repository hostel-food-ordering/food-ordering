import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const returnValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((error) => `${error.msg}`)
      .join(", ");
    return res.status(400).send({ message: errorMessage });
  }
  next();
};
