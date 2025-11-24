import session from 'express-session';
import MongoStore from 'connect-mongo';

export function setupSession(app: any) {
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE?.replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD as string
      ),
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  });
  app.use(sessionMiddleware);
  return sessionMiddleware;
}
