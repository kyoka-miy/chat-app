import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../config/tokens';
import { ObjectId } from 'mongodb';
import { IMessage } from '../../domain/model/messageModel';
import { IMessageRepository } from '../../repository/IMessageRepository';

@injectable()
export class GetMessagesUseCase {
  constructor(@inject(TOKENS.MessageRepository) private messageRepo: IMessageRepository) {}

  async execute(chatRoomId: ObjectId): Promise<IMessage[]> {
    return this.messageRepo.findByChatRoomId(chatRoomId);
  }
}
