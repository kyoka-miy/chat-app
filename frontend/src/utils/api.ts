export async function getChatRooms() {
  const res = await fetch(`http://localhost:3000/chat-rooms`, {
    credentials: "include", // Send cookies with request
  });
  if (!res.ok) throw new Error("Failed to fetch chat rooms");
  return res.json();
}

export async function deleteChatRoom(chatRoomId: string) {
  const res = await fetch(`http://localhost:3000/chat-rooms/${chatRoomId}`, {
    method: "DELETE",
    credentials: "include", // Send cookies with request
  });
  if (!res.ok) throw new Error("Failed to delete chat room");
  return res.json();
}

export async function getAccount() {
    const res = await fetch(`http://localhost:3000/accounts/me`, {
      credentials: "include", // Send cookies with request
    });
    return res.json();
}
