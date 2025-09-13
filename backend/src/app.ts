import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(cookieParser());

export default app;
