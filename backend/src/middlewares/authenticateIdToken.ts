import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../firebaseAdmin";
import { asyncLocalStorage } from "../utils/asyncLocalStorage";

export const authenticateIdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("No token provided.");
    return;
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { email } = decodedToken;

    const storedAccount = asyncLocalStorage.getStore()?.account;
    if (storedAccount.email !== email) {
      res.status(401).send("Token email does not match stored account email.");
      return;
    }
    next();
  } catch (error) {
    console.error("Failed to authenticate:", error);
    res.status(401).send("Unauthorized");
  }
};
