import { injectable } from 'inversify';
import { Account, IAccount } from '../../domain/model/accountModel';
import { IAccountRepository } from '../IAccountRepository';
import { ObjectId } from 'mongodb';
import { AppError } from '../../utils/appError';

@injectable()
export class AccountRepository implements IAccountRepository {
  async findFriendsByAccountId(accountId: ObjectId): Promise<ObjectId[]> {
    const account = await Account.findById(accountId).populate('friends').exec();
    if (!account) throw new AppError('Account not found', 404);
    return account.friends;
  }

  async findAllExceptMe(myAccountId: ObjectId): Promise<IAccount[]> {
    return Account.find({ _id: { $ne: myAccountId } }).exec();
  }

  async findByIds(accountIds: ObjectId[]): Promise<IAccount[]> {
    return Account.find({ _id: { $in: accountIds } }).exec();
  }

  async findById(accountId: ObjectId): Promise<IAccount> {
    const account = await Account.findById(accountId).populate('friends').exec();
    if (!account) throw new AppError('Account not found', 404);
    return account;
  }

  async findByUserId(userId: string): Promise<IAccount | null> {
    return Account.findOne({ userId }).exec();
  }

  async findByEmail(email: string): Promise<IAccount | null> {
    return Account.findOne({ email }).populate('friends').exec();
  }

  async insert(account: IAccount): Promise<IAccount> {
    const newAccount = new Account(account);
    return newAccount.save();
  }

  async addFriend(myAccountId: ObjectId, friend: IAccount): Promise<void> {
    await Account.updateOne({ _id: myAccountId }, { $addToSet: { friends: friend._id } }).exec();
    await Account.updateOne({ _id: friend._id }, { $addToSet: { friends: myAccountId } }).exec();
  }

  async findByUserIdExceptMeAndFriends(
    myAccountId: ObjectId,
    userId: string
  ): Promise<IAccount | null> {
    const myAccount = await Account.findById(myAccountId).populate('friends').exec();
    if (!myAccount) throw new AppError('Your account not found', 404);
    const friendIds = myAccount.friends?.map((f: any) => f._id) || [];
    // find accounts whose userId matches, excluding myself and my friends
    return Account.findOne({
      userId,
      _id: { $ne: myAccountId, $nin: friendIds },
    }).exec();
  }
}
