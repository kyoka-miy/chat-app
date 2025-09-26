"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, ChatRoom } from "../../components/Sidebar";
import { ChatMessages, Message } from "../../components/ChatMessages";
import { MessageInput } from "../../components/MessageInput";
import { getSocket } from "../../utils/socket";
import { getChatRooms } from "../../utils/api";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { useAccount } from "@/context/AccountContext";

export default function Home() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string>("");
  const [messages, setMessages] = useState<{ [roomId: string]: Message[] }>({});
  const { account } = useAccount();

  useEffect(() => {
    getChatRooms()
      .then((data) => {
        setChatRooms(data);
        if (data.length > 0) setCurrentChatRoomId(data[0]._id);
      })
      .catch(() => setChatRooms([]));
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (currentChatRoomId) {
      socket.emit("joinRoom", currentChatRoomId);
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
  }, [currentChatRoomId]);

  const handleSend = (text: string) => {
    const socket = getSocket();
    socket.emit("chatMessage", {
      text,
      chatRoomId: currentChatRoomId,
    });
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        rooms={chatRooms}
        currentRoomId={currentChatRoomId}
        onSelectRoom={setCurrentChatRoomId}
      />
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center p-4 border-b">
          <>
            <span>Welcome, {account?.name}</span>
            <button
              onClick={logout}
              className="ml-4 px-3 py-1 bg-gray-400 rounded hover:cursor-pointer"
            >
              Logout
            </button>
          </>
        </div>
        <header className="p-4 border-b bg-gray-50 dark:bg-gray-900">
          <h1 className="text-xl font-bold">
            {chatRooms.find((r) => r._id === currentChatRoomId)?.name}
          </h1>
        </header>
        <ChatMessages messages={messages[currentChatRoomId] || []} />
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
