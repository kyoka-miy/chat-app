import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { Account } from "../../domain/model/accountModel";
import { firebaseAdmin } from "../../firebaseAdmin";

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
    // Set idToken in httpOnly cookie
    res.cookie("idToken", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      const { email } = decodedToken;
    console.log("Decoded Token:", decodedToken);
      let account = await Account.findOne({ email });

      if (!account) {
        return res
          .status(404)
          .json({ error: "Account not found. Please sign up first." });
      }

      // Store account info in session
      req.session.account = account;
      res
        .status(200)
        .json({ message: "Authentication success", account: account });
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
      // Store account info in session
      req.session.account = account;
      res.status(201).json({ message: "Account created", account: account });
    } catch (error) {
      console.error("Failed to sign up:", error);
      res.status(401).send("Failed to verify ID token.");
    }
  });
}
