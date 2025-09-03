import "reflect-metadata";
import express from "express";
import { AccountController } from "../controller/accountController";
import { authenticateIdToken } from "../../middlewares/authenticateIdToken";

const accountRouter = express.Router();

const accountController = new AccountController();

accountRouter.get("/", accountController.getAccounts);

export default accountRouter;
