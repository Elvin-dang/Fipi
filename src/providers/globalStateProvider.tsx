"use client";

import { type ReactNode, createContext, useRef, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";

import { type GlobalStore, createGlobalStore, initGlobalStore } from "@/stores/globalStore";
import Spinner from "@/components/Spinner";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";

export type GlobalStoreApi = ReturnType<typeof createGlobalStore>;

export const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(undefined);

export interface GlobalStoreProviderProps {
  children: ReactNode;
  data: {
    id: string;
    token: string;
    roomId: string;
  };
}

export const GlobalStoreProvider = ({ children, data }: GlobalStoreProviderProps) => {
  const [isAuth, setIsAuth] = useState(false);
  const storeRef = useRef<GlobalStoreApi>(null);

  useEffect(() => {
    const asyncTask = async () => {
      await signInWithCustomToken(auth, data.token);
      setIsAuth(true);
    };
    asyncTask();
  }, []);

  if (!storeRef.current) {
    storeRef.current = createGlobalStore(initGlobalStore(data.id, data.roomId));
  }

  return isAuth ? (
    <GlobalStoreContext.Provider value={storeRef.current}>{children}</GlobalStoreContext.Provider>
  ) : (
    <Spinner />
  );
};

export const useGlobalStore = <T,>(selector: (store: GlobalStore) => T): T => {
  const globalStoreContext = useContext(GlobalStoreContext);

  if (!globalStoreContext) {
    throw new Error(`useGlobalStore must be used within GlobalStoreProvider`);
  }

  return useStore(globalStoreContext, selector);
};
