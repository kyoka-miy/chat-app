import "reflect-metadata";
import "./src/config/di-container/container";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { setupSocket } from "./src/presentation/socket/socket";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./src/app";

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

setupSocket(io);

dotenv.config({ path: "./config.env" });

if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  throw new Error("Database environment variable is not defined.");
}
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD as string
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
