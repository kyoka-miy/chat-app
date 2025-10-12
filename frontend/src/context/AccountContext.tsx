"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getAccount } from "../utils/api";
import { Account } from "@/utils/type";

interface AccountContextType {
  account: Account | null;
  setAccount: React.Dispatch<React.SetStateAction<Account | null>>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context)
    throw new Error("useAccount must be used within AccountProvider");
  return context;
};

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    getAccount().then((data) => {
      setAccount(data);
    });
  }, []);

  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
};
