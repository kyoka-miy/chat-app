import "reflect-metadata";
import express from "express";
import {
  AddChatRoomDto,
  ChatRoomController,
  DeleteChatRoomDto,
  GetChatRoomsDto,
} from "../controller/chatRoomController";
import { validateDto } from "../../middlewares/validateDto";
import { authenticateIdToken } from "../../middlewares/authenticateIdToken";
import { container } from "tsyringe";

const chatRoomRouter = express.Router();

const chatRoomController = container.resolve(ChatRoomController);

chatRoomRouter.get(
  "/",
  authenticateIdToken,
  validateDto(GetChatRoomsDto),
  chatRoomController.getChatRooms
);
chatRoomRouter.post(
  "/",
  authenticateIdToken,
  validateDto(AddChatRoomDto),
  chatRoomController.addChatRoom
);
chatRoomRouter.delete(
  "/:chatRoomId",
  authenticateIdToken,
  validateDto(DeleteChatRoomDto),
  chatRoomController.deleteChatRoom
);

export default chatRoomRouter;
