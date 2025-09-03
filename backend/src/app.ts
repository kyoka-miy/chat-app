import express from "express";
import accountRouter from "./presentation/routes/accountRoutes";
import chatRoomRouter from "./presentation/routes/chatRoomRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { AppError } from "./utils/appError";
import messageRouter from "./presentation/routes/messageRoutes";
import cors from "cors";
import authRouter from "./presentation/routes/authRoutes";
import { authenticateIdToken } from "./middlewares/authenticateIdToken";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/accounts", accountRouter);
app.use("/chat-rooms", chatRoomRouter);
app.use("/messages", messageRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

export default app;
