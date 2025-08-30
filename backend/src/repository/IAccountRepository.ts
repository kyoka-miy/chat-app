import { ObjectId } from "mongodb";
import { Account, IAccount } from "../domain/model/accountModel";

export interface IAccountRepository {
  findAll(): Promise<IAccount[]>;
  findByIds(accountIds: ObjectId[]): Promise<IAccount[]>;
}