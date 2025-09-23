import { IAccount } from "../domain/model/accountModel";
import session from "express-session";
import "express-serve-static-core";
import { IncomingMessage } from "http";

declare module "express-session" {
  interface SessionData {
    account?: IAccount;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    account?: IAccount;
  }
}

declare module "http" {
  interface IncomingMessage {
    session?: session.Session & Partial<session.SessionData>;
  }
}
