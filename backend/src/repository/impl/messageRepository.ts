import { ObjectId } from "mongodb";
import { IMessage, Message } from "../../domain/model/messageModel";
import { IMessageRepository } from "../IMessageRepository";

export class MessageRepository implements IMessageRepository {
  async findByChatRoomId(chatRoomId: ObjectId): Promise<IMessage[]> {
    return Message.find({ chatRoom: chatRoomId })
      .select("-chatRoom")
      .populate({
        path: "sender",
        select: "-chatRooms",
      })
      .sort({ sentDateTime: 1 })
      .exec();
  }

  async addMessage(
    text: string,
    chatRoomId: ObjectId,
    senderAccountId: ObjectId
  ): Promise<void> {
    const message = new Message({
      text,
      sentDateTime: new Date(),
      chatRoom: chatRoomId,
      sender: senderAccountId,
    });
    await message.save();
  }

  async deleteAllByChatRoomId(chatRoomId: ObjectId): Promise<void> {
    await Message.deleteMany({ chatRoom: chatRoomId });
  }
}
