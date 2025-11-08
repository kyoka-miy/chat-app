import 'reflect-metadata';
import express from 'express';
import {
  AccountController,
  AddFriendDto,
  SearchAccountsDto,
} from '../controller/accountController';
import { authenticateIdToken } from '../../middlewares/authenticateIdToken';
import { container } from 'tsyringe';
import { validateDto } from '../../middlewares/validateDto';

const accountRouter = express.Router();

const accountController = container.resolve(AccountController);

accountRouter.get('/me', authenticateIdToken, accountController.getAccount);
accountRouter.get('/', authenticateIdToken, accountController.getAccounts);
accountRouter.post(
  '/friends/:userId',
  authenticateIdToken,
  validateDto(AddFriendDto),
  accountController.addFriend
);
accountRouter.get('/search', authenticateIdToken, accountController.searchAccounts);

export default accountRouter;
