import express from "express";
import { GetMessagesDto, MessageController } from "../controller/messageController";
import { validateDto } from "../../middlewares/validateDto";
import { authenticateIdToken } from "../../middlewares/authenticateIdToken";
import { container } from "tsyringe";

const messageRouter = express.Router();

const messageController = container.resolve(MessageController);

messageRouter.get(
  "/",
  authenticateIdToken,
  validateDto(GetMessagesDto),
  messageController.getMessages
);

export default messageRouter;