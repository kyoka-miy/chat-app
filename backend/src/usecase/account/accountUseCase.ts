import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../config/tokens';
import { IAccountRepository } from '../../repository/IAccountRepository';
import { ObjectId } from 'mongodb';
import { AppError } from '../../utils/appError';

@injectable()
export class AccountUseCase {
  constructor(@inject(TOKENS.AccountRepository) private accountRepo: IAccountRepository) {}

  async getAccounts(myAccountId: ObjectId) {
    return this.accountRepo.findAllExceptMe(myAccountId);
  }

  async addFriendByEmail(myAccountId: ObjectId, email: string) {
    const friend = await this.accountRepo.findByEmail(email);
    if (!friend) {
      throw new AppError('Account with the provided email does not exist', 404);
    }
    if (friend._id.equals(myAccountId)) {
      throw new AppError('Cannot add yourself as a friend', 400);
    }
    return this.accountRepo.addFriend(myAccountId, friend);
  }
}
