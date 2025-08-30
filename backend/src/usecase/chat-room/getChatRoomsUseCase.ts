import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../config/di-container/tokens";
import { IChatRoomRepository } from "../../repository/IChatRoomRepository";
import { ObjectId } from "mongodb";
import { IChatRoom } from "../../domain/model/chatRoomModel";

@injectable()
export class GetChatRoomsUseCase {
  constructor(
    @inject(TOKENS.ChatRoomRepository) private chatRoomRepo: IChatRoomRepository
  ) {}

  async execute(accountId: ObjectId): Promise<IChatRoom[]> {
    return this.chatRoomRepo.findAllByAccountId(accountId);
  }
}
