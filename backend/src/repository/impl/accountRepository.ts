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
}
