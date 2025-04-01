import { create } from "zustand";

type PostStore = {
  savedPosts: Set<string>; // Use Set for O(1) lookups
  savePost: (uuid: string) => void;
  unsavePost: (uuid: string) => void;
  isSavedPost: (uuid: string) => boolean;
};

export const usePostStore = create<PostStore>((set, get) => ({
  savedPosts: new Set(),
  savePost: (uuid) =>
    set((state) => ({
      savedPosts: new Set(state.savedPosts).add(uuid),
    })),
  unsavePost: (uuid: string) => {
    set((state) => {
      const newSet = new Set(state.savedPosts); // Copy the current Set
      newSet.delete(uuid); // Remove the post from the new Set
      return { savedPosts: newSet }; // Update the state with the new Set
    });
  },
  isSavedPost: (uuid: string) => get().savedPosts.has(uuid), // O(1) lookup
}));
