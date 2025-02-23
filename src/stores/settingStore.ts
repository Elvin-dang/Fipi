import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { devtoolsInNonProd } from "./globalStore";

export type State = {
  autoSave: boolean | "indeterminate";
};

export type Actions = {
  setAutoSave: (state: boolean | "indeterminate") => void;
  getAutoSave: () => State["autoSave"];
};

export type SettingStore = State & Actions;

export const initSettingStore = (): State => {
  return { autoSave: false };
};

export const defaultInitState: State = { autoSave: false };

export const createSettingStore = (initState: State = defaultInitState) => {
  return createStore<SettingStore>()(
    devtoolsInNonProd(
      persist(
        (set, get) => ({
          ...initState,
          setAutoSave: (state) => {
            set({ autoSave: state });
          },
          getAutoSave: () => get().autoSave,
        }),
        {
          name: "setting-store",
        }
      )
    )
  );
};
