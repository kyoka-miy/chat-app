import { CONSTANTS } from "./constants";

export async function getChatRooms() {
  const res = await fetch(CONSTANTS.ENDPOINT.CHAT_ROOMS, {
    credentials: "include",
  });
  return res.json();
}

export async function deleteChatRoom(chatRoomId: string) {
  const res = await fetch(CONSTANTS.ENDPOINT.CHAT_ROOM(chatRoomId), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete chat room");
  return res.json();
}

export async function getAccount() {
  const res = await fetch(CONSTANTS.ENDPOINT.ACCOUNT_ME, {
    credentials: "include",
  });
  return res.json();
}

export async function getAccounts() {
  const res = await fetch(CONSTANTS.ENDPOINT.ACCOUNTS, {
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
  const res = await fetch(CONSTANTS.ENDPOINT.CHAT_ROOMS, {
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
  const res = await fetch(CONSTANTS.ENDPOINT.AUTH_LOGOUT, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}
