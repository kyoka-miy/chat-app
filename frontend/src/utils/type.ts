export type Message = {
  _id: string;
  text: string;
  sentDateTime: Date;
  isRead: boolean;
  sender: Account;
  chatRoom: string;
};

export type Account = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  createdAt: Date;
  chatRooms: string[];
  friends: Account[];
};

export type ChatRoom = {
  _id: string;
  name: string;
  createdDateTime: Date;
  accounts: string[];
  messages: string[];
};
