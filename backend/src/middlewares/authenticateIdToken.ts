import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../firebaseAdmin";
import { AppError } from "../utils/appError";

export const authenticateIdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.cookies?.idToken;
  if (!idToken) {
    res.status(401).send("No token provided.");
    return;
  }

  const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
  const { email } = decodedToken;

  if (!req.session?.account || req.session.account.email !== email) {
    throw new AppError("Invalid session", 401);
  }

  req.account = req.session.account;
  next();
};
