import { Request, Response } from "express";
import { GetChatRoomsUseCase } from "../../usecase/chat-room/getChatRoomsUseCase";
import { autoInjectable } from "tsyringe";
import { ObjectId } from "mongodb";
import { AddChatRoomUseCase } from "../../usecase/chat-room/addChatRoomUseCase";
import { catchAsync } from "../../middlewares/catchAsync";
import { Length } from "class-validator";
import { ValidObjectId } from "../../validators/validObjectId";
import { DeleteChatRoomUseCase } from "../../usecase/chat-room/deleteChatRoomUseCase";

@autoInjectable()
export class ChatRoomController {
  constructor(
    private getChatRoomsUseCase: GetChatRoomsUseCase,
    private addChatRoomsUseCase: AddChatRoomUseCase,
    private deleteChatRoomUseCase: DeleteChatRoomUseCase
  ) {}

  getChatRooms = catchAsync(async (req: Request, res: Response) => {
    const accountId = req.account?._id;
    if (!accountId) {
      res.status(400).json({ message: "Account ID is not set in session" });
      return;
    }
    const chatRooms = await this.getChatRoomsUseCase.execute(accountId);
    res.status(200).json(chatRooms);
  });

  addChatRoom = catchAsync(async (req: Request, res: Response) => {
    const { name, accountIds } = req.body;
    await this.addChatRoomsUseCase.execute(name, accountIds);
    res.status(201).json({ message: "Chat room created successfully" });
  });

  deleteChatRoom = catchAsync(async (req: Request, res: Response) => {
    const chatRoomId = new ObjectId(req.params.chatRoomId as string);
    await this.deleteChatRoomUseCase.execute(chatRoomId);
    res.status(200).json({ message: "Chat room deleted successfully" });
  });
}

export class AddChatRoomDto {
  @Length(1, 100, { message: "Name must be 1-100 characters" })
  name!: string;
  @ValidObjectId({ each: true })
  accountIds!: ObjectId[];
}

export class DeleteChatRoomDto {
  @ValidObjectId()
  chatRoomId!: ObjectId;
}
