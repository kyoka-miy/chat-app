import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin } from '../firebaseAdmin';
import { AppError } from '../utils/appError';

export const authenticateIdToken = async (req: Request, res: Response, next: NextFunction) => {
  const idToken = req.cookies.idToken;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError('No refresh token provided', 401);
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const { email } = decodedToken;

    if (!req.session?.account || req.session.account.email !== email) {
      throw new AppError('Invalid session', 401);
    }
    req.account = req.session.account;
    return next();
  } catch (err: any) {
    console.error('Token verification error:', err);
    // If token is expired, try to refresh it
    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error') {
      try {
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
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        // Verify new token and update session/account
        const newDecodedToken = await firebaseAdmin.auth().verifyIdToken(data.id_token);
        const { email } = newDecodedToken;
        if (!req.session?.account || req.session.account.email !== email) {
          throw new AppError('Invalid session after refresh', 401);
        }
        req.account = req.session.account;
        return next();
      } catch (refreshErr) {
        return next(new AppError('Invalid token after refresh', 401));
      }
    }
    return next(new AppError('Invalid token', 401));
  }
};
