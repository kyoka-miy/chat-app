import { Server as SocketIOServer } from "socket.io";
import { container } from "tsyringe";
import { AddMessageUseCase } from "../../usecase/message/addMessageUseCase";
import { ObjectId } from "mongodb";
import { formatMessage } from "../../middlewares/messages";
import { GetMessagesUseCase } from "../../usecase/message/GetMessagesUseCase";

const botName = "ChatBot";

const users: { id: string; username: string; room: string }[] = [];

function userJoin(id: string, username: string, room: string) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function getCurrentUser(id: string) {
  return users.find((user) => user.id === id);
}

function userLeave(id: string) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  return null;
}

function getRoomUsers(room: string) {
  return users.filter((user) => user.room === room);
}

export function setupSocket(io: SocketIOServer) {
  io.on("connection", (socket) => {
    socket.on("joinRoom", async ({ username, room }) => {
      console.log(`User ${username} joined room ${room}`);
      const user = userJoin(socket.id, username, room);
      socket.join(room);

      // 過去メッセージ取得し、joinRoomイベントで返す
      try {
        const getMessagesUseCase = container.resolve(GetMessagesUseCase);
        const messages = await getMessagesUseCase.execute(new ObjectId(room));
        socket.emit("joinRoom", { messages });
      } catch (err) {
        socket.emit("error", { message: "メッセージ取得に失敗しました" });
      }

      socket.emit("message", formatMessage(botName, "Welcome to the chat!"));
      socket.broadcast
        .to(room)
        .emit(
          "message",
          formatMessage(botName, `${username} has joined the chat!`)
        );
    });

    socket.on("chatMessage", async (data) => {
      const { text, chatRoomId, accountId } = data;
      if (!text || !chatRoomId || !accountId) return;
      const addMessageUseCase = container.resolve(AddMessageUseCase);
      await addMessageUseCase.execute(
        text,
        new ObjectId(chatRoomId),
        new ObjectId(accountId)
      );
      io.to(chatRoomId).emit("newMessage", {
        text,
        chatRoomId,
        sender: accountId,
        sentDateTime: new Date(),
      });
    });

    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat.`)
        );
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
}
