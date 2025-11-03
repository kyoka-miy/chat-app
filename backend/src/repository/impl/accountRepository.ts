import { injectable } from 'inversify';
import { Account, IAccount } from '../../domain/model/accountModel';
import { IAccountRepository } from '../IAccountRepository';
import { ObjectId } from 'mongodb';
import { AppError } from '../../utils/appError';

@injectable()
export class AccountRepository implements IAccountRepository {
  async findAllExceptMe(myAccountId: ObjectId): Promise<IAccount[]> {
    return Account.find({ _id: { $ne: myAccountId } }).exec();
  }

  async findByIds(accountIds: ObjectId[]): Promise<IAccount[]> {
    return Account.find({ _id: { $in: accountIds } }).exec();
  }

  async findByUserId(userId: string): Promise<IAccount | null> {
    return Account.findOne({ userId }).exec();
  }

  async findByEmail(email: string): Promise<IAccount | null> {
    return Account.findOne({ email }).exec();
  }

  async insert(account: IAccount): Promise<IAccount> {
    const newAccount = new Account(account);
    return newAccount.save();
  }

  async addFriend(myAccountId: ObjectId, friend: IAccount): Promise<IAccount> {
    await Account.updateOne({ _id: myAccountId }, { $addToSet: { friends: friend._id } }).exec();
    const updatedAccount = await Account.findById(myAccountId).populate('friends').exec();
    if (!updatedAccount) throw new AppError('Account not found', 404);
    return updatedAccount;
  }
}
