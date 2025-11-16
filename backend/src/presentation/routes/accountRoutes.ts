import 'reflect-metadata';
import express from 'express';
import { AccountController, UserIdDto } from '../controller/accountController';
import { authenticateIdToken } from '../../middlewares/authenticateIdToken';
import { container } from 'tsyringe';
import { validateDto } from '../../middlewares/validateDto';

const accountRouter = express.Router();

const accountController = container.resolve(AccountController);

accountRouter.get('/me', authenticateIdToken, accountController.getAccount);
accountRouter.get('/', authenticateIdToken, accountController.getAccounts);
// body??
accountRouter.post(
  '/add-friend/:userId',
  authenticateIdToken,
  validateDto(UserIdDto),
  accountController.addFriend
);
accountRouter.get('/search', authenticateIdToken, accountController.searchAccountsBySearchText);
accountRouter.get(
  '/:userId',
  authenticateIdToken,
  validateDto(UserIdDto),
  accountController.findAccountById
);

export default accountRouter;
