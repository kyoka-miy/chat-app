import 'reflect-metadata';
import express from 'express';
import {
  AccountController,
  AccountIdDto,
  UserIdAndNameDto,
  UserIdDto,
} from '../controller/accountController';
import { authenticateIdToken } from '../../middlewares/authenticateIdToken';
import { container } from 'tsyringe';
import { validateDto } from '../../middlewares/validateDto';

const accountRouter = express.Router();

const accountController = container.resolve(AccountController);

accountRouter.get('/me', authenticateIdToken, accountController.getAccount);
accountRouter.get('/', authenticateIdToken, accountController.getAccounts);

accountRouter.post(
  '/friends',
  authenticateIdToken,
  validateDto(AccountIdDto),
  accountController.addFriend
);
accountRouter.get('/friends', authenticateIdToken, accountController.searchFriendsBySearchText);
accountRouter.get(
  '/:userId',
  authenticateIdToken,
  validateDto(UserIdDto),
  accountController.findAccountByUserId
);
accountRouter.put(
  '/',
  authenticateIdToken,
  validateDto(UserIdAndNameDto),
  accountController.updateUserIdAndName
);

export default accountRouter;
