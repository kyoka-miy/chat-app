import 'reflect-metadata';
import express from 'express';
import { AccountController, AddFriendDto } from '../controller/accountController';
import { authenticateIdToken } from '../../middlewares/authenticateIdToken';
import { container } from 'tsyringe';
import { validateDto } from '../../middlewares/validateDto';

const accountRouter = express.Router();

const accountController = container.resolve(AccountController);

accountRouter.get('/me', authenticateIdToken, accountController.getAccount);
accountRouter.get('/', authenticateIdToken, accountController.getAccounts);
accountRouter.post(
  '/friends/:email',
  authenticateIdToken,
  validateDto(AddFriendDto),
  accountController.addFriend
);

export default accountRouter;
