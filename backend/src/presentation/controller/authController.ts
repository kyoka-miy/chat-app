import { Request, Response } from "express";
import { catchAsync } from "../../middlewares/catchAsync";
import { AppError } from "../../utils/appError";
import { autoInjectable } from "tsyringe";
import { LoginUseCase } from "../../usecase/auth/loginUseCase";
import { SignupUseCase } from "../../usecase/auth/signupUseCase";

@autoInjectable()
export class AuthController {
  constructor(
    private loginUsecase: LoginUseCase,
    private signupUseCase: SignupUseCase
  ) {}

  login = catchAsync(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }
    const idToken = authHeader.split("Bearer ")[1];
    const account = await this.loginUsecase.execute(idToken);

    // Set idToken in httpOnly cookie
    res.cookie("idToken", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }
    const idToken = authHeader.split("Bearer ")[1];
    const account = await this.signupUseCase.execute(idToken);

    // Set idToken in httpOnly cookie
    res.cookie("idToken", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    // Store account info in session
    if (req.session) {
      req.session.account = account;
    }
    res.status(201).json({ message: "Account created", account: account });
  });
}
