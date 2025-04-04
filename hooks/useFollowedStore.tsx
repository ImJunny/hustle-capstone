import { create } from "zustand";

type FollowedStore = {
  followed: Set<string>;
  follow: (uuid: string) => void;
  unfollow: (uuid: string) => void;
  isFollowed: (uuid: string) => boolean;
  checked: Set<string>;
  addChecked: (uuid: string) => void;
  isChecked: (uuid: string) => boolean;
};

export const useFollowedStore = create<FollowedStore>((set, get) => ({
  followed: new Set(),
  follow: (uuid) =>
    set((state) => {
      const newFollowed = new Set(state.followed);
      newFollowed.add(uuid);
      return { followed: newFollowed };
    }),
  unfollow: (uuid: string) =>
    set((state) => {
      const newFollowed = new Set(state.followed);
      newFollowed.delete(uuid);
      return { followed: newFollowed };
    }),
  isFollowed: (uuid: string) => get().followed.has(uuid),
  checked: new Set(),
  addChecked: (uuid: string) => {
    set((state) => {
      const newChecked = new Set(state.checked);
      newChecked.add(uuid);
      return { checked: newChecked };
    });
  },
  isChecked: (uuid: string) => get().checked.has(uuid),
}));
