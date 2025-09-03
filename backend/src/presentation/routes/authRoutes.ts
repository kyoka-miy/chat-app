import express from "express";
import { AuthController } from "../controller/authController";

const authRouter = express.Router();

const authController = new AuthController();

authRouter.post("/verify-token", authController.verifyToken);

export default authRouter;
