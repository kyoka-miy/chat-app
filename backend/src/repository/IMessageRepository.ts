import { ObjectId } from 'mongodb';
import { IMessage } from '../domain/model/messageModel';

export interface IMessageRepository {
  findByChatRoomId(chatRoomId: ObjectId): Promise<IMessage[]>;
  addMessage(text: string, chatRoomId: ObjectId, senderAccountId: ObjectId): Promise<void>;
  deleteAllByChatRoomId(chatRoomId: ObjectId): Promise<void>;
}
