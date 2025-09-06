import { asyncLocalStorage } from "../utils/asyncLocalStorage";

export function getAccountFromContext() {
  const store = asyncLocalStorage.getStore();
  if (!store || !store.account) {
    throw new Error("No account found in context. Make sure authenticateIdToken middleware is used.");
  }
  return store.account;
}
