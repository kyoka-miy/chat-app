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
    const myAccount = await this.accountRepo.findById(myAccountId);
    if (myAccount.friends?.some((f: any) => f._id.equals(friend._id))) {
      throw new AppError('This account is already your friend', 400);
    }
    this.accountRepo.addFriend(myAccountId, friend);
    return;
  }
  //FIXME: Search from friends only, not all accounts
  async searchAccounts(myAccountId: ObjectId, searchText: string) {
    const allAccounts = await this.accountRepo.findAllExceptMe(myAccountId);
    const lowerSearchText = searchText.toLowerCase().trim();
    return allAccounts.filter(
      (account) =>
        account.name.toLowerCase().includes(lowerSearchText) ||
        // FIXME: once all userId filled, remove the check
        (account.userId && account.userId.toLowerCase().includes(lowerSearchText))
    );
  }

  async searchAccountById(myAccountId: ObjectId, userId: string) {
    console.log('Searching for userId:', userId);
    if (!userId || userId.length === 0) {
      return null;
    }
    return this.accountRepo.findByUserIdExceptMeAndFriends(myAccountId, userId.trim());
  }
}
