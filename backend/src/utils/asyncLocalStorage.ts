import { AsyncLocalStorage } from "async_hooks";

export interface ContextType {
  account?: any;
}

export const asyncLocalStorage = new AsyncLocalStorage<ContextType>();
