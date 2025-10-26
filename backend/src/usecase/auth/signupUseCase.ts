import { inject, injectable } from 'tsyringe';
import { IAccountRepository } from '../../repository/IAccountRepository';
import { TOKENS } from '../../config/tokens';
import { AppError } from '../../utils/appError';
import { firebaseAdmin } from '../../firebaseAdmin';
import { Account, IAccount } from '../../domain/model/accountModel';

@injectable()
export class SignupUseCase {
  constructor(
    @inject(TOKENS.AccountRepository)
    private accountRepo: IAccountRepository
  ) {}

  async execute(idToken: string): Promise<IAccount> {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;
    if (!email) {
      throw new AppError('Email not found in token.', 400);
    }
    let account = await this.accountRepo.findByEmail(email);
    if (account) {
      throw new AppError('Account already exists', 409);
    }

    const newAccount = new Account({
      email,
      name,
      createdAt: new Date(),
    });
    account = await this.accountRepo.insert(newAccount);

    return account;
  }
}
