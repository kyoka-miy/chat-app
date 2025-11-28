import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../config/tokens';
import { IChatRoomRepository } from '../../repository/IChatRoomRepository';
import { ObjectId } from 'mongodb';
import { IAccountRepository } from '../../repository/IAccountRepository';
import { AppError } from '../../utils/appError';

@injectable()
export class AddChatRoomUseCase {
  constructor(
    @inject(TOKENS.ChatRoomRepository)
    private chatRoomRepo: IChatRoomRepository,
    @inject(TOKENS.AccountRepository) private accountRepo: IAccountRepository
  ) {}

  async execute(name: string, accountIds: ObjectId[]) {
    const accounts = await this.accountRepo.findByIds(accountIds);
    if (accounts.length !== accountIds.length) {
      throw new AppError('Some accountIds do not exist or contain duplicates', 400);
    }
    const newChatRoom = await this.chatRoomRepo.addChatRooms(name, accountIds);
    for (const account of accounts) {
      account.chatRooms = account.chatRooms || [];
      account.chatRooms.push(newChatRoom._id);
      await this.accountRepo.update(account);
    }
  }
}
