import { create } from "zustand";

type PostStore = {
  savedPosts: Set<string>;
  savePost: (uuid: string) => void;
  unsavePost: (uuid: string) => void;
  isSavedPost: (uuid: string) => boolean;
  reset: () => void;
};

export const usePostStore = create<PostStore>((set, get) => ({
  savedPosts: new Set(),
  savePost: (uuid) =>
    set((state) => ({
      savedPosts: new Set(state.savedPosts).add(uuid),
    })),
  unsavePost: (uuid: string) => {
    set((state) => {
      const newSet = new Set(state.savedPosts);
      newSet.delete(uuid);
      return { savedPosts: newSet };
    });
  },
  isSavedPost: (uuid: string) => get().savedPosts.has(uuid),
  reset: () => set({ savedPosts: new Set() }),
}));
