import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import { GetAccountsUseCase } from "../../usecase/account/GetAccountsUseCase";
import { catchAsync } from "../../middlewares/catchAsync";

@autoInjectable()
export class AccountController {
  constructor(private getAccountsUsecase?: GetAccountsUseCase) {}

  getAccounts = catchAsync(async (req: Request, res: Response) => {
    const accounts = await this.getAccountsUsecase?.execute();
    res.status(200).json(accounts);
  });
}
