import { create } from "zustand";

type MessageStore = {
  readChats: Set<string>;
  addReadChat: (uuid: string) => void;
  isReadChat: (uuid: string) => boolean;
  fetchedChats: boolean;
  reset: () => void;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
  readChats: new Set(),
  addReadChat: (uuid) =>
    set((state) => ({
      readChats: new Set(state.readChats).add(uuid),
    })),
  isReadChat: (uuid: string) => get().readChats.has(uuid),
  fetchedChats: false,
  reset: () => set({ readChats: new Set(), fetchedChats: false }),
}));
