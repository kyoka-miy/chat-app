import { getAccount } from "@/utils/api";
import React, { useEffect, useState } from "react";

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
  name: string;
  email: string;
  createdAt: Date;
};

type ChatMessagesProps = {
  messages: Message[];
};

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const [account, setAccount] = useState<Account>();
  console.log(messages);
  useEffect(() => {
    getAccount().then((data) => {
      setAccount(data);
    });
  }, []);
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg, index) => {
        const isOwn = msg.sender._id === account?._id;
        return (
          <div
            key={index}
            className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
          >
            {!isOwn && (
              <span className="text-xs mb-1 text-gray-500">
                {msg.sender.name}
              </span>
            )}
            <div
              className={`flex items-end gap-2 ${
                isOwn ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`rounded px-3 py-2 text-sm max-w-xs break-words ${
                  isOwn
                    ? "bg-green-400 text-white dark:bg-green-500"
                    : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-xs text-gray-400 select-none whitespace-nowrap">
                {new Date(msg.sentDateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
