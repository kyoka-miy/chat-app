import { ObjectId } from 'mongodb';
import { ChatRoom, IChatRoom } from '../../domain/model/chatRoomModel';
import { IChatRoomRepository } from '../IChatRoomRepository';
import { AppError } from '../../utils/appError';

export class ChatRoomRepository implements IChatRoomRepository {
  async findAllByAccountId(accountId: ObjectId): Promise<IChatRoom[]> {
    return ChatRoom.find({ accounts: accountId })
      .populate({
        path: 'accounts',
        select: '-chatRooms',
      })
      .sort({ createdDateTime: -1 })
      .exec();
  }

  async addChatRooms(name: string, accountIds: ObjectId[]): Promise<IChatRoom> {
    const chatRoom = new ChatRoom({
      name,
      createdDateTime: new Date(),
      accounts: accountIds,
    });
    return await chatRoom.save();
  }

  async deleteById(chatRoomId: ObjectId): Promise<void> {
    const deletedChatRoom = await ChatRoom.findByIdAndDelete({
      _id: chatRoomId,
    });
    if (!deletedChatRoom) {
      throw new AppError('Chat room not found', 404);
    }
  }
}
