import { inject, injectable } from "tsyringe";
import { ObjectId } from "mongodb";
import { IChatRoomRepository } from "../../repository/IChatRoomRepository";
import { TOKENS } from "../../config/di-container/tokens";
import { IMessageRepository } from "../../repository/IMessageRepository";

@injectable()
export class DeleteChatRoomUseCase {
  constructor(
    @inject(TOKENS.ChatRoomRepository)
    private chatRoomRepo: IChatRoomRepository,
    @inject(TOKENS.MessageRepository) private messageRepo: IMessageRepository
  ) {}

  async execute(chatRoomId: ObjectId): Promise<void> {
    await this.chatRoomRepo.deleteById(chatRoomId);
    await this.messageRepo.deleteAllByChatRoomId(chatRoomId);
  }
}
