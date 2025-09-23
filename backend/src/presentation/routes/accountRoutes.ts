import "reflect-metadata";
import express from "express";
import { AccountController } from "../controller/accountController";
import { authenticateIdToken } from "../../middlewares/authenticateIdToken";
import { container } from "tsyringe";

const accountRouter = express.Router();

const accountController = container.resolve(AccountController);

accountRouter.get("/me", authenticateIdToken, accountController.getAccount);
accountRouter.get("/", authenticateIdToken, accountController.getAccounts);

export default accountRouter;
