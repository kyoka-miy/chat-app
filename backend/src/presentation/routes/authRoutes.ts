import express from 'express';
import { AuthController, AuthenticationDto, RefreshTokenDto } from '../controller/authController';
import { container } from 'tsyringe';
import { validateDto } from '../../middlewares/validateDto';

const authRouter = express.Router();

const authController = container.resolve(AuthController);

authRouter.post('/login', validateDto(AuthenticationDto), authController.login);
authRouter.post('/signup', validateDto(AuthenticationDto), authController.signup);
authRouter.post('/logout', authController.logout);
authRouter.post('/refresh-token', validateDto(RefreshTokenDto), authController.refreshToken);

export default authRouter;
