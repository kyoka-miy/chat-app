import { Request, Response } from 'express';
import { catchAsync } from '../../middlewares/catchAsync';
import { autoInjectable } from 'tsyringe';
import { LoginUseCase } from '../../usecase/auth/loginUseCase';
import { SignupUseCase } from '../../usecase/auth/signupUseCase';
import { firebaseAdmin } from '../../firebaseAdmin';
import { IsNotEmpty, IsString } from 'class-validator';
import { AppError } from '../../utils/appError';
import { IAccount } from '../../domain/model/accountModel';

@autoInjectable()
export class AuthController {
  constructor(
    private loginUsecase: LoginUseCase,
    private signupUseCase: SignupUseCase
  ) {}

  login = catchAsync(async (req: Request, res: Response) => {
    const { idToken, refreshToken } = req.body;
    const account = await this.loginUsecase.execute(idToken);

    this.setTokenAndSession(res, idToken, refreshToken, req, account);
    res.status(200).json({ message: 'Authentication success', account: account });
  });
  // FIXME: Add userId and name
  signup = catchAsync(async (req: Request, res: Response) => {
    const { idToken, refreshToken } = req.body;
    const account = await this.signupUseCase.execute(idToken);

    this.setTokenAndSession(res, idToken, refreshToken, req, account);
    res.status(201).json({ message: 'Account created', account: account });
  });

  logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie('idToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    res.clearCookie('connect.sid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    if (req.session) {
      req.session.destroy(() => {});
    }
    res.status(200).json({ message: 'Logout success' });
  });

  refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      }
    );
    const data = await response.json();
    if (!data.id_token) {
      throw new AppError('Failed to refresh token', 401);
    }
    res.cookie('idToken', data.id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    // Verify new token and update session/account
    const newDecodedToken = await firebaseAdmin.auth().verifyIdToken(data.id_token);
    const { email } = newDecodedToken;
    if (!req.session?.account || req.session.account.email !== email) {
      throw new AppError('Invalid session after refresh', 401);
    }
    req.account = req.session.account;

    res.status(200).json({ message: 'Refresh token success' });
  });

  private setTokenAndSession(
    res: Response,
    idToken: any,
    refreshToken: any,
    req: Request,
    account: IAccount
  ) {
    res.cookie('idToken', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    if (req.session) {
      req.session.account = account;
    }
  }
}

export class AuthenticationDto {
  @IsString()
  @IsNotEmpty()
  idToken!: string;
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
