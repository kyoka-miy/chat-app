import "reflect-metadata";
import express from "express";
import {
  AddChatRoomDto,
  ChatRoomController,
  DeleteChatRoomDto,
  GetChatRoomsDto,
} from "../controller/chatRoomController";
import { validateDto } from "../../middlewares/validateDto";

const chatRoomRouter = express.Router();

const chatRoomController = new ChatRoomController();

chatRoomRouter.get(
  "/",
  validateDto(GetChatRoomsDto),
  chatRoomController.getChatRooms
);
chatRoomRouter.post(
  "/",
  validateDto(AddChatRoomDto),
  chatRoomController.addChatRoom
);
chatRoomRouter.delete(
  "/:chatRoomId",
  validateDto(DeleteChatRoomDto),
  chatRoomController.deleteChatRoom
);

export default chatRoomRouter;
