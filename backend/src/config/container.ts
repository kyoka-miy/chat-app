import { container } from 'tsyringe';
import { AccountRepository } from '../repository/impl/accountRepository';
import { TOKENS } from './tokens';
import { IAccountRepository } from '../repository/IAccountRepository';
import { IChatRoomRepository } from '../repository/IChatRoomRepository';
import { ChatRoomRepository } from '../repository/impl/chatRoomRepository';
import { MessageRepository } from '../repository/impl/messageRepository';

container.register<IAccountRepository>(TOKENS.AccountRepository, {
  useClass: AccountRepository,
});

container.register<IChatRoomRepository>(TOKENS.ChatRoomRepository, {
  useClass: ChatRoomRepository,
});

container.register(TOKENS.MessageRepository, {
  useClass: MessageRepository,
});
