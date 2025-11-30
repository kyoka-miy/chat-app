import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../config/tokens';
import { IAccountRepository } from '../../repository/IAccountRepository';
import { ObjectId } from 'mongodb';
import { AppError } from '../../utils/appError';

@injectable()
export class AccountUseCase {
  constructor(@inject(TOKENS.AccountRepository) private accountRepo: IAccountRepository) {}

  async getMyAccount(myAccountId: ObjectId) {
    const account = await this.accountRepo.findById(myAccountId);
    return account;
  }

  async getAccounts(myAccountId: ObjectId) {
    return this.accountRepo.findAllExceptMe(myAccountId);
  }

  async addFriendByUserId(myAccountId: ObjectId, accountId: ObjectId) {
    const friend = await this.accountRepo.findById(accountId);

    const myAccount = await this.accountRepo.findById(myAccountId);
    if (myAccount.friends?.some((f: any) => f._id.equals(friend._id))) {
      throw new AppError('This account is already your friend', 400);
    }
    this.accountRepo.addFriend(myAccountId, friend);
    return;
  }

  async searchFriends(myAccountId: ObjectId, searchText: string) {
    const friendIds = await this.accountRepo.findFriendsByAccountId(myAccountId);
    const friends = await this.accountRepo.findByIds(friendIds);
    const lowerSearchText = searchText ? searchText.toLowerCase().trim() : '';
    return friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(lowerSearchText) ||
        friend.userId.toLowerCase().includes(lowerSearchText)
    );
  }

  async searchAccountById(myAccountId: ObjectId, userId: string) {
    if (!userId || userId.length === 0) {
      return null;
    }
    return this.accountRepo.findByUserIdExceptMeAndFriends(myAccountId, userId.trim());
  }

  async updateUserIdAndName(accountId: ObjectId, userId: string, name: string) {
    const existingAccount = await this.accountRepo.findByUserId(userId);
    if (existingAccount && !existingAccount._id.equals(accountId)) {
      throw new AppError('This userId is already taken', 400);
    }
    const account = await this.accountRepo.findById(accountId);
    account.userId = userId;
    account.name = name;
    await this.accountRepo.update(account);
    return;
  }
}
