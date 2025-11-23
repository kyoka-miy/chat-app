'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
require('reflect-metadata');
require('./src/config/container');
const socket_io_1 = require('socket.io');
const http_1 = __importDefault(require('http'));
const socket_1 = require('./src/presentation/socket/socket');
const mongoose_1 = __importDefault(require('mongoose'));
const dotenv_1 = __importDefault(require('dotenv'));
const app_1 = __importDefault(require('./src/app'));
const session_1 = require('./src/config/session');
const accountRoutes_1 = __importDefault(require('./src/presentation/routes/accountRoutes'));
const chatRoomRoutes_1 = __importDefault(require('./src/presentation/routes/chatRoomRoutes'));
const messageRoutes_1 = __importDefault(require('./src/presentation/routes/messageRoutes'));
const authRoutes_1 = __importDefault(require('./src/presentation/routes/authRoutes'));
const errorHandler_1 = require('./src/middlewares/errorHandler');
const appError_1 = require('./src/utils/appError');
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
(0, socket_1.setupSocket)(io);
dotenv_1.default.config({ path: './config.env' });
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  throw new Error('Database environment variable is not defined.');
}
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(DB).then(() => {
  console.log('DB connection successful!');
  const sessionMiddleware = (0, session_1.setupSession)(app_1.default); // Get session middleware instance
  // Register routes after session middleware
  app_1.default.use('/accounts', accountRoutes_1.default);
  app_1.default.use('/chat-rooms', chatRoomRoutes_1.default);
  app_1.default.use('/messages', messageRoutes_1.default);
  app_1.default.use('/auth', authRoutes_1.default);
  app_1.default.use((req, res, next) => {
    next(new appError_1.AppError(`Route ${req.originalUrl} not found`, 404));
  });
  app_1.default.use(errorHandler_1.errorHandler);
  // Socket.io: use session middleware
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
