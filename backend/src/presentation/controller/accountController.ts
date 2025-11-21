import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { catchAsync } from '../../middlewares/catchAsync';
import { AccountUseCase } from '../../usecase/account/accountUseCase';
import { AppError } from '../../utils/appError';
import { IsString } from 'class-validator';
import { ValidObjectId } from '../../validators/validObjectId';
import { ObjectId } from 'mongodb';

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

  getFriends = catchAsync(async (req: Request, res: Response) => {
    const account = req.account;
    if (!account) {
      throw new AppError('Account not found in session', 404);
    }
    const friends = account.friends || [];
    res.status(200).json(friends);
  });

  addFriend = catchAsync(async (req: Request, res: Response) => {
    const myAccountId = req.account?._id;
    if (!myAccountId) {
      throw new AppError('Account ID is not set in session', 404);
    }
    const accountId = req.body.accountId as ObjectId;

    await this.accountUsecase.addFriendByUserId(myAccountId, accountId);
    res.status(201).json({ message: 'Friend added successfully' });
  });

  searchFriendsBySearchText = catchAsync(async (req: Request, res: Response) => {
    const myAccountId = req.account?._id;
    if (!myAccountId) {
      throw new AppError('Account ID is not set in session', 404);
    }
    const searchText = req.query.searchText as string;

    const accounts = await this.accountUsecase.searchFriends(myAccountId, searchText);
    res.status(200).json(accounts);
  });

  findAccountByUserId = catchAsync(async (req: Request, res: Response) => {
    const accountId = req.account?._id;
    if (!accountId) {
      res.status(400).json({ message: 'Account ID is not set in session' });
      return;
    }

    const accounts = await this.accountUsecase.searchAccountById(accountId, req.params.userId);
    res.status(200).json(accounts);
  });
}

export class AccountIdDto {
  @ValidObjectId()
  accountId!: ObjectId;
}

export class SearchAccountsDto {
  @IsString()
  searchText!: string;
}

export class UserIdDto {
  @IsString()
  userId!: string;
}
