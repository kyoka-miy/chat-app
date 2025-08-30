export async function getChatRooms(accountId: string) {
  const res = await fetch(
    `http://localhost:3000/chat-rooms?accountId=${accountId}`
  );
  if (!res.ok) throw new Error("Failed to fetch chat rooms");
  return res.json();
}

export async function deleteChatRoom(chatRoomId: string) {
  const res = await fetch(`http://localhost:3000/chat-rooms/${chatRoomId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete chat room");
  return res.json();
}
