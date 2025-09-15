import { injectable } from "inversify";
import { Account, IAccount } from "../../domain/model/accountModel";
import { IAccountRepository } from "../IAccountRepository";
import { ObjectId } from "mongodb";

@injectable()
export class AccountRepository implements IAccountRepository {
  async findAll(): Promise<IAccount[]> {
    return Account.find();
  }

  async findByIds(accountIds: ObjectId[]): Promise<IAccount[]> {
    return Account.find({ _id: { $in: accountIds } }).exec();
  }

  async findByEmail(email: string): Promise<IAccount | null> {
    return Account.findOne({ email }).exec();
  }

  async insert(account: IAccount): Promise<IAccount> {
    const newAccount = new Account(account);
    return newAccount.save();
  }
}
