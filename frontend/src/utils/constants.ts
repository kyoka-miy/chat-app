const endpointBase = process.env.REACT_APP_ENDPOINT_BASE || 'http://localhost:3000';
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
    ACCOUNT_ADD_FRIEND: (accountId: string) =>
      `${endpointBase}/accounts/add-friend/${encodeURIComponent(accountId)}`,
  },
  LINK: {
    SIGN_UP: `/sign-up`,
    LOGIN: `/login`,
    HOME: `/home`,
  },
};
