import { ObjectId } from 'mongodb';
import { Account, IAccount } from '../domain/model/accountModel';

export interface IAccountRepository {
  findAllExceptMe(myAccountId: ObjectId): Promise<IAccount[]>;
  findByIds(accountIds: ObjectId[]): Promise<IAccount[]>;
  findByUserId(userId: string): Promise<IAccount | null>;
  findByEmail(email: string): Promise<IAccount | null>;
  insert(account: IAccount): Promise<IAccount>;
  addFriend(myAccountId: ObjectId, friend: IAccount): Promise<IAccount>;
  findByUserIdExceptMeAndFriends(myAccountId: ObjectId, userId: string): Promise<IAccount | null>;
}
