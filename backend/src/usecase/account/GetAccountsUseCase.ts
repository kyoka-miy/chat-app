import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../config/tokens';
import { IAccountRepository } from '../../repository/IAccountRepository';
import { ObjectId } from 'mongodb';

@injectable()
export class GetAccountsUseCase {
  constructor(@inject(TOKENS.AccountRepository) private accountRepo: IAccountRepository) {}

  async execute(myAccountId: ObjectId) {
    return this.accountRepo.findAllExceptMe(myAccountId);
  }
}
