// TODO: Store idToken in cookie, set it in request header

export async function getChatRooms(accountId: string) {
  const res = await fetch(
    `http://localhost:3000/chat-rooms?accountId=${accountId}`,
    {
      credentials: "include", // Send cookies with request
    }
  );
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
