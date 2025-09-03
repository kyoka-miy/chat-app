import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../firebaseAdmin";

export const authenticateIdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("No token provided.");
    next();
    return;
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Failed to authenticate:", error);
    res.status(401).send("Unauthorized");
    next(error);
  }
};
