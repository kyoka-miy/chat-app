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
    credentials: "include",
  });
  return res.json();
}

export async function getAccounts() {
  const res = await fetch(`http://localhost:3000/accounts`, {
    credentials: "include",
  });
  return res.json();
}

export async function addChatRoom({
  name,
  accountIds,
}: {
  name: string;
  accountIds: string[];
}) {
  const res = await fetch(`http://localhost:3000/chat-rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, accountIds }),
  });
  return res.json();
}

export async function logout() {
  const res = await fetch("http://localhost:3000/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

export async function refreshToken() {
  const res = await fetch("http://localhost:3000/auth/refresh-token", {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}
