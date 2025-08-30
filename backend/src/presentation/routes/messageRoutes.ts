import express from "express";
import { GetMessagesDto, MessageController } from "../controller/messageController";
import { validateDto } from "../../middlewares/validateDto";

const messageRouter = express.Router();

const messageController = new MessageController();

messageRouter.get(
  "/",
  validateDto(GetMessagesDto),
  messageController.getMessages
);

export default messageRouter;