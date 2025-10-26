import { inject, injectable } from 'tsyringe';
import { IAccountRepository } from '../../repository/IAccountRepository';
import { TOKENS } from '../../config/tokens';
import { AppError } from '../../utils/appError';
import { firebaseAdmin } from '../../firebaseAdmin';
import { IAccount } from '../../domain/model/accountModel';

@injectable()
export class LoginUseCase {
  constructor(
    @inject(TOKENS.AccountRepository)
    private accountRepo: IAccountRepository
  ) {}

  async execute(idToken: string): Promise<IAccount> {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { email } = decodedToken;
    if (!email) {
      throw new AppError('Email not found in token.', 400);
    }
    const account = await this.accountRepo.findByEmail(email);

    if (!account) {
      throw new AppError('Account not found. Please sign up first.', 404);
    }

    return account;
  }
}
