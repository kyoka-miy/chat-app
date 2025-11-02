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

  async addFriendByUserId(myAccountId: ObjectId, userId: string) {
    const friend = await this.accountRepo.findByUserId(userId);
    if (!friend) {
      throw new AppError('Account with the provided userId does not exist', 404);
    }
    if (friend._id.equals(myAccountId)) {
      throw new AppError('Cannot add yourself as a friend', 400);
    }
    return this.accountRepo.addFriend(myAccountId, friend);
  }

  async searchAccounts(myAccountId: ObjectId, searchText: string) {
    const allAccounts = await this.accountRepo.findAllExceptMe(myAccountId);
    const lowerSearchText = searchText.toLowerCase().trim();
    return lowerSearchText.length > 0
      ? allAccounts.filter(
          (account) =>
            account.name.toLowerCase().includes(lowerSearchText) ||
            // FIXME: once all userId filled, remove the check
            (account.userId && account.userId.toLowerCase().includes(lowerSearchText))
        )
      : [];
  }
}
