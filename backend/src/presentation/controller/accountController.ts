import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import { catchAsync } from "../../middlewares/catchAsync";
import { GetAccountsUseCase } from "../../usecase/account/GetAccountsUseCase";
import { AppError } from "../../utils/appError";

@autoInjectable()
export class AccountController {
  constructor(private getAccountsUsecase: GetAccountsUseCase) {}

  getAccount = catchAsync(async (req: Request, res: Response) => {
    const account = req.account;
    if (!account) {
      throw new AppError("Account not found in session", 404);
    }
    res.status(200).json(account);
  });

  // TODO: fetch only followed accounts, add pagination, search, etc.
  getAccounts = catchAsync(async (req: Request, res: Response) => {
    const accounts = await this.getAccountsUsecase.execute();
    res.status(200).json(accounts);
  });
}
