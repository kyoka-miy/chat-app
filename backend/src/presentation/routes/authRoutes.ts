import express from "express";
import { AuthController } from "../controller/authController";

const authRouter = express.Router();

const authController = new AuthController();

authRouter.post("/login", authController.login);
authRouter.post("/signup", authController.signup);

export default authRouter;
