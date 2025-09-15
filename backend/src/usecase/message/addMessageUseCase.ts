import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../config/tokens";
import { IMessageRepository } from "../../repository/IMessageRepository";
import { ObjectId } from "mongodb";

@injectable()
export class AddMessageUseCase {
  constructor(
    @inject(TOKENS.MessageRepository)
    private messageRepo: IMessageRepository
  ) {}

  async execute(text: string, chatRoomId: ObjectId, senderAccountId: ObjectId) {
    await this.messageRepo.addMessage(text, chatRoomId, senderAccountId);
  }
}
