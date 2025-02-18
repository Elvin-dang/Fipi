"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type SettingStore, createSettingStore, initSettingStore } from "@/stores/settingStore";

export type SettingStoreApi = ReturnType<typeof createSettingStore>;

export const SettingStoreContext = createContext<SettingStoreApi | undefined>(undefined);

export interface SettingStoreProviderProps {
  children: ReactNode;
}

export const SettingStoreProvider = ({ children }: SettingStoreProviderProps) => {
  const storeRef = useRef<SettingStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createSettingStore(initSettingStore());
  }

  return (
    <SettingStoreContext.Provider value={storeRef.current}>{children}</SettingStoreContext.Provider>
  );
};

export const useSettingStore = <T,>(selector: (store: SettingStore) => T): T => {
  const settingStoreContext = useContext(SettingStoreContext);

  if (!settingStoreContext) {
    throw new Error(`useSettingStore must be used within SettingStoreProvider`);
  }

  return useStore(settingStoreContext, selector);
};
