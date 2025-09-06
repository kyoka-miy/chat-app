import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { Account } from "../../domain/model/accountModel";
import { firebaseAdmin } from "../../firebaseAdmin";
import { asyncLocalStorage } from "../../utils/asyncLocalStorage";

export class AuthController {
  login = catchAsync(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }
    const idToken = authHeader.split("Bearer ")[1];

    if (!idToken) {
      return res.status(400).send("No ID token provided.");
    }

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      const { email } = decodedToken;

      let account = await Account.findOne({ email });

      if (!account) {
        return res
          .status(404)
          .json({ error: "Account not found. Please sign up first." });
      }

      asyncLocalStorage.run({ account }, () => {
        res
          .status(200)
          .json({ message: "Authentication success", user: account });
      });
    } catch (error) {
      console.error("Failed to authenticate token:", error);
      res.status(401).send("Failed to verify ID token.");
    }
  });

  signup = catchAsync(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }
    const idToken = authHeader.split("Bearer ")[1];

    if (!idToken) {
      return res.status(400).send("No ID token provided.");
    }

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      const { email, name } = decodedToken;

      let account = await Account.findOne({ email });
      if (account) {
        return res.status(409).json({ error: "Account already exists." });
      }

      account = new Account({
        email,
        name,
        createdAt: new Date(),
      });
      await account.save();
      console.log("Registered a new account:", email);
      asyncLocalStorage.run({ account }, () => {
        res.status(201).json({ message: "Account created", user: account });
      });
    } catch (error) {
      console.error("Failed to sign up:", error);
      res.status(401).send("Failed to verify ID token.");
    }
  });
}
