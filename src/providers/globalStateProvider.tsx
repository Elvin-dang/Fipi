"use client";

import { type ReactNode, createContext, useRef, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";

import { type GlobalStore, createGlobalStore, initGlobalStore } from "@/stores/globalStore";
import Spinner from "@/components/Spinner";

export type GlobalStoreApi = ReturnType<typeof createGlobalStore>;

export const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(undefined);

export interface GlobalStoreProviderProps {
  children: ReactNode;
}

export const GlobalStoreProvider = ({ children }: GlobalStoreProviderProps) => {
  const storeRef = useRef<GlobalStoreApi>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchInitGlobalState = async () => {
      storeRef.current = createGlobalStore(await initGlobalStore());
      setIsFetching(false);
    };
    fetchInitGlobalState();
  }, []);

  return !isFetching && storeRef.current ? (
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
