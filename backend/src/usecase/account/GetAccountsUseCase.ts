import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../config/tokens";
import { IAccountRepository } from "../../repository/IAccountRepository";

@injectable()
export class GetAccountsUseCase {
  constructor(
    @inject(TOKENS.AccountRepository) private accountRepo: IAccountRepository
  ) {}

  async execute() {
    return this.accountRepo.findAll();
  }
}
