import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../firebaseAdmin";
import { Account } from "../domain/model/accountModel";

export const authenticateIdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.cookies?.idToken;
  console.log("ID Token from cookie:", idToken);
  if (!idToken) {
    res.status(401).send("No token provided.");
    return;
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { email } = decodedToken;

    // Get account info from session if available
    if (
      req.session &&
      req.session.account &&
      req.session.account.email === email
    ) {
      req.account = req.session.account;
      return next();
    }

    // If not in session, fetch from DB and store in session
    const account = await Account.findOne({ email });
    if (!account) {
      res.status(401).send("Account not found.");
      return;
    }
    req.session.account = account;
    req.account = account;
    next();
  } catch (error) {
    console.error("Failed to authenticate:", error);
    res.status(401).send("Unauthorized");
  }
};
