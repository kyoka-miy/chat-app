import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

export function setupSession(app: any) {
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "dev_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      dbName: mongoose.connection.db?.databaseName,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      sameSite: "lax",
      secure: false,
    },
  });
  app.use(sessionMiddleware);
  return sessionMiddleware;
}
