import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { catchAsync } from '../../middlewares/catchAsync';
import { AccountUseCase } from '../../usecase/account/accountUseCase';
import { AppError } from '../../utils/appError';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

@autoInjectable()
export class AccountController {
  constructor(private accountUsecase: AccountUseCase) {}

  getAccount = catchAsync(async (req: Request, res: Response) => {
    const account = req.account;
    if (!account) {
      throw new AppError('Account not found in session', 404);
    }
    res.status(200).json(account);
  });

  getAccounts = catchAsync(async (req: Request, res: Response) => {
    const account = req.account;
    if (!account) {
      throw new AppError('Account not found in session', 404);
    }
    const accounts = await this.accountUsecase.getAccounts(account._id);
    res.status(200).json(accounts);
  });

  addFriend = catchAsync(async (req: Request, res: Response) => {
    const accountId = req.account?._id;
    if (!accountId) {
      res.status(400).json({ message: 'Account ID is not set in session' });
      return;
    }
    const account = await this.accountUsecase.addFriendByUserId(accountId, req.params.userId);
    res.status(201).json(account);
  });

  searchAccounts = catchAsync(async (req: Request, res: Response) => {
    const accountId = req.account?._id;
    if (!accountId) {
      res.status(400).json({ message: 'Account ID is not set in session' });
      return;
    }
    const searchText = req.query.searchText as string;

    const accounts = await this.accountUsecase.searchAccounts(accountId, searchText);
    res.status(200).json(accounts);
  });
}

export class AddFriendDto {
  userId!: string;
}

export class SearchAccountsDto {
  @IsString()
  searchText!: string;
}
