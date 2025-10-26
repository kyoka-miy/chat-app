import { ObjectId } from 'mongodb';
import { IChatRoom } from '../domain/model/chatRoomModel';

export interface IChatRoomRepository {
  findAllByAccountId(accountId: ObjectId): Promise<IChatRoom[]>;
  addChatRooms(name: string, accountIds: ObjectId[]): Promise<void>;
  deleteById(chatRoomId: ObjectId): Promise<void>;
}
