const isProd = process.env.NODE_ENV === 'production';
const endpointBase = isProd ? '/api' : process.env.NEXT_PUBLIC_BACKEND_URL;
export const CONSTANTS = {
  ENDPOINT: {
    AUTH_SIGNUP: `${endpointBase}/auth/signup`,
    AUTH_LOGIN: `${endpointBase}/auth/login`,
    AUTH_LOGOUT: `${endpointBase}/auth/logout`,
    CHAT_ROOMS: `${endpointBase}/chat-rooms`,
    CHAT_ROOM: (chatRoomId: string) => `${endpointBase}/chat-rooms/${chatRoomId}`,
    ACCOUNT_ME: `${endpointBase}/accounts/me`,
    ACCOUNTS: `${endpointBase}/accounts`,
    ACCOUNTS_SEARCH: (searchText: string) =>
      `${endpointBase}/accounts/search?searchText=${encodeURIComponent(searchText)}`,
    ACCOUNT_FIND_BY_ID: (userId: string) =>
      `${endpointBase}/accounts/${encodeURIComponent(userId)}`,
    ACCOUNTS_FRIENDS: `${endpointBase}/accounts/friends`,
    ACCOUNTS_FRIENDS_SEARCH: (searchText: string) =>
      `${endpointBase}/accounts/friends?searchText=${encodeURIComponent(searchText)}`,
  },
  LINK: {
    SIGN_UP: `/sign-up`,
    LOGIN: `/login`,
    HOME: `/home`,
  },
};
