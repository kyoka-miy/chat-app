import 'reflect-metadata';
import './src/config/container';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { setupSocket } from './src/presentation/socket/socket';
import mongoose from 'mongoose';
import app from './src/app';
import { setupSession } from './src/config/session';
import accountRouter from './src/presentation/routes/accountRoutes';
import chatRoomRouter from './src/presentation/routes/chatRoomRoutes';
import messageRouter from './src/presentation/routes/messageRoutes';
import authRouter from './src/presentation/routes/authRoutes';
import { errorHandler } from './src/middlewares/errorHandler';
import { AppError } from './src/utils/appError';
import { Request, Response, NextFunction } from 'express';

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupSocket(io);

if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  throw new Error('Database environment variable is not defined.');
}
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD as string);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
  const sessionMiddleware = setupSession(app);
  app.use(sessionMiddleware);
  
  app.use('/accounts', accountRouter);
  app.use('/chat-rooms', chatRoomRouter);
  app.use('/messages', messageRouter);
  app.use('/auth', authRouter);

  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
  });
  app.use(errorHandler);

  // Socket.io: use session middleware
  io.use((socket, next) => {
    sessionMiddleware(socket.request as any, {} as any, next as any);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    const url = process.env.BACKEND_URL;
    console.log(`Server is running at ${url}`);
  });
});
