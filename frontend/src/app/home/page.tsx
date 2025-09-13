"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, ChatRoom } from "../../components/Sidebar";
import { ChatMessages, Message } from "../../components/ChatMessages";
import { MessageInput } from "../../components/MessageInput";
import { getSocket } from "../../utils/socket";
import { getChatRooms } from "../../utils/api";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { signOut } from "firebase/auth";

export default function Home() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string>("");
  const [messages, setMessages] = useState<{ [roomId: string]: Message[] }>({});
  const [accountId, setAccountId] = useState<string>(
    "687b5c9ab5cb3f391d1e3747"
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setAccountId(firebaseUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

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

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setAccountId("");
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
          {user && (
            <>
              <span>Welcome, {user.displayName || user.email}</span>
              <button
                onClick={logout}
                className="ml-4 px-3 py-1 bg-gray-400 rounded hover:cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
        <header className="p-4 border-b bg-gray-50 dark:bg-gray-900">
          <h1 className="text-xl font-bold">
            {chatRooms.find((r) => r._id === currentChatRoomId)?.name}
          </h1>
        </header>
        <ChatMessages
          messages={messages[currentChatRoomId] || []}
          account={accountId}
        />
        <MessageInput
          onSend={handleSend}
          user={accountId}
          setAccount={setAccountId}
        />
      </div>
    </div>
  );
}
