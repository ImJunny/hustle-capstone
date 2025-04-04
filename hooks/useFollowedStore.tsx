import { create } from "zustand";

type FollowedStore = {
  followed: Set<string>;
  isFollowed: (uuid: string) => boolean;
  setFollowed: (user_uuid: string, is_following: boolean) => void;
  fetched: Set<string>;
  setFetched: (user_uuid: string) => void;
  dataUpdatedAt: number;
  setDataUpdatedAt: (timestamp: number) => void;
  fetchedFollowed: boolean;
  reset: () => void;
};

export const useFollowedStore = create<FollowedStore>((set, get) => ({
  followed: new Set(),
  isFollowed: (uuid) => get().followed.has(uuid),
  setFollowed: (user_uuid, is_following) =>
    set((state) => {
      const newFollowed = new Set(state.followed);
      if (is_following) newFollowed.add(user_uuid);
      else newFollowed.delete(user_uuid);
      return { followed: newFollowed };
    }),
  fetched: new Set(),
  setFetched: (user_uuid) =>
    set((state) => {
      const newFetched = new Set(state.fetched);
      newFetched.add(user_uuid);
      return { fetched: newFetched };
    }),
  dataUpdatedAt: 0,
  setDataUpdatedAt: (timestamp) =>
    set(() => {
      return { dataUpdatedAt: timestamp };
    }),
  fetchedFollowed: false,
  reset: () =>
    set({
      followed: new Set(),
      fetched: new Set(),
      dataUpdatedAt: 0,
      fetchedFollowed: false,
    }),
}));
