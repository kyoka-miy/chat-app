import { Server as SocketIOServer } from 'socket.io';
import { container } from 'tsyringe';
import { AddMessageUseCase } from '../../usecase/message/addMessageUseCase';
import { ObjectId } from 'mongodb';
import { formatMessage } from '../../middlewares/messages';
import { GetMessagesUseCase } from '../../usecase/message/getMessagesUseCase';

const botName = 'ChatBot';

const users: { id: string; accountId: ObjectId; chatRoomId: ObjectId }[] = [];

function userJoin(id: string, accountId: ObjectId, chatRoomId: ObjectId) {
  const user = { id, accountId, chatRoomId };
  users.push(user);
  return user;
}

function userLeave(id: string) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  return null;
}

function getRoomUsers(chatRoomId: ObjectId) {
  return users.filter((user) => user.chatRoomId === chatRoomId);
}

export function setupSocket(io: SocketIOServer) {
  io.on('connection', (socket) => {
    const account = socket.request.session?.account;
    if (!account) {
      console.log('No account in session');
      return;
    }

    socket.on('joinRoom', async (chatRoomId) => {
      console.log(`User ${account.name} joined room ${chatRoomId}`);
      userJoin(socket.id, account._id, chatRoomId);
      socket.join(chatRoomId);

      try {
        const getMessagesUseCase = container.resolve(GetMessagesUseCase);
        const messages = await getMessagesUseCase.execute(chatRoomId);
        socket.emit('joinRoom', { messages });
      } catch (err) {
        socket.emit('error', { message: 'Failed to get messages' });
      }

      socket.broadcast
        .to(chatRoomId)
        .emit('message', formatMessage(botName, `${account.name} has joined the chat!`));
    });

    socket.on('chatMessage', ({ text, chatRoomId }) => {
      if (!text || !chatRoomId) return;
      io.to(chatRoomId).emit('newMessage', {
        text,
        sender: account,
        sentDateTime: new Date(),
      });
      const addMessageUseCase = container.resolve(AddMessageUseCase);
      addMessageUseCase.execute(text, chatRoomId, account._id);
    });

    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      if (user) {
        io.to(user.chatRoomId.toString()).emit(
          'message',
          formatMessage(botName, `${user.chatRoomId} has left the chat.`)
        );
        io.to(user.chatRoomId.toString()).emit('roomUsers', {
          room: user.chatRoomId,
          users: getRoomUsers(user.chatRoomId),
        });
      }
    });
  });
}
