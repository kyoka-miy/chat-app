import express from "express";
import { AuthController } from "../controller/authController";
import { container } from "tsyringe";

const authRouter = express.Router();

const authController = container.resolve(AuthController);

authRouter.post("/login", authController.login);
authRouter.post("/signup", authController.signup);
authRouter.post("/logout", authController.logout);

export default authRouter;
