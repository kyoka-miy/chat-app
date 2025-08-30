"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, ChatRoom } from "../components/Sidebar";
import { ChatMessages, Message } from "../components/ChatMessages";
import { MessageInput } from "../components/MessageInput";
import { getSocket } from "../utils/socket";
import { getChatRooms } from "../utils/api";

export default function Home() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string>("");
  const [messages, setMessages] = useState<{ [roomId: string]: Message[] }>({});
  const [accountId, setAccountId] = useState<string>("687b5c9ab5cb3f391d1e3747");

  useEffect(() => {
    if (!accountId) return;
    getChatRooms(accountId)
      .then((data) => {
        setChatRooms(data);
        if (data.length > 0) setCurrentChatRoomId(data[0]._id);
      })
      .catch(() => setChatRooms([]));
  }, [accountId]);

  useEffect(() => {
    const socket = getSocket();
    if (accountId && currentChatRoomId) {
      socket.emit("joinRoom", { username: accountId, room: currentChatRoomId });
    }
    socket.off("message");
    socket.on("newMessage", (msg: any) => {
      setMessages((prev) => ({
        ...prev,
        [currentChatRoomId]: [...(prev[currentChatRoomId] || []), msg],
      }));
    });
    socket.on("joinRoom", (data: any) => {
      setMessages((prev) => ({
        ...prev,
        [currentChatRoomId]: data.messages,
      }));
    });
    return () => {
      socket.off("newMessage");
      socket.off("joinRoom");
    };
  }, [accountId, currentChatRoomId]);

  const handleSend = (text: string) => {
    if (!accountId) return;
    const socket = getSocket();
    socket.emit("chatMessage", {
      text,
      chatRoomId: currentChatRoomId,
      // FIXME: Return account object from context
      accountId: accountId,
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        rooms={chatRooms}
        currentRoomId={currentChatRoomId}
        onSelectRoom={setCurrentChatRoomId}
      />
      <div className="flex flex-col flex-1 h-full">
        <header className="p-4 border-b bg-gray-50 dark:bg-gray-900">
          <h1 className="text-xl font-bold">
            {chatRooms.find((r) => r._id === currentChatRoomId)?.name}
          </h1>
        </header>
        <ChatMessages messages={messages[currentChatRoomId] || []} account={accountId}/>
        <MessageInput onSend={handleSend} user={accountId} setAccount={setAccountId} />
      </div>
    </div>
  );
}
