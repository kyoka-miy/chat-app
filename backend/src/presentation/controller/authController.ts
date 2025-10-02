import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { AppError } from "../../utils/appError";
import { autoInjectable } from "tsyringe";
import { LoginUseCase } from "../../usecase/auth/loginUseCase";
import { SignupUseCase } from "../../usecase/auth/signupUseCase";
import { firebaseAdmin } from "../../firebaseAdmin";
import { IsNotEmpty, IsString } from "class-validator";

@autoInjectable()
export class AuthController {
  constructor(
    private loginUsecase: LoginUseCase,
    private signupUseCase: SignupUseCase
  ) {}

  login = catchAsync(async (req: Request, res: Response) => {
    const { idToken, refreshToken } = req.body;
    const account = await this.loginUsecase.execute(idToken);

    // Set idToken in httpOnly cookie
    res.cookie("idToken", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 1 day
    });
    // Set refreshToken in httpOnly cookie if present in request
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Store account info in session
    if (req.session) {
      req.session.account = account;
    }
    res
      .status(200)
      .json({ message: "Authentication success", account: account });
  });

  signup = catchAsync(async (req: Request, res: Response) => {
    const { idToken, refreshToken } = req.body;
    const account = await this.signupUseCase.execute(idToken);

    // Set idToken in httpOnly cookie
    res.cookie("idToken", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });
    // Set refreshToken in httpOnly cookie if present in request
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Store account info in session
    if (req.session) {
      req.session.account = account;
    }
    res.status(201).json({ message: "Account created", account: account });
  });

  logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("idToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    if (req.session) {
      req.session.destroy(() => {});
    }
    res.status(200).json({ message: "Logout success" });
  });

  refreshToken = catchAsync(async (req: Request, res: Response) => {
    const idToken = req.cookies.idToken;
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }
    let decoded = null;
    let expired = false;
    if (idToken) {
      try {
        decoded = await firebaseAdmin.auth().verifyIdToken(idToken, true);
      } catch (err: any) {
        if (err.code === "auth/id-token-expired") {
          expired = true;
        } else {
          return res.status(401).json({ message: "Invalid idToken" });
        }
      }
    } else {
      expired = true;
    }
    if (!expired) {
      return res.status(200).json({ message: "Token still valid" });
    }
    try {
      const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        }
      );
      const data = await response.json();
      res.cookie("idToken", data.id_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
      });
      res.status(200).json({ message: "Token refreshed" });
    } catch (e) {
      res.status(401).json({ message: "Failed to refresh token" });
    }
  });
}

export class AuthenticationDto {
  @IsString()
  @IsNotEmpty()
  idToken!: string;
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
