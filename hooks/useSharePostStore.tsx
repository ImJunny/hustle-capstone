import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { RefObject } from "react";
import { create } from "zustand";

type SharePostStore = {
  postUUID: string | undefined;
  setPostUUID: (uuid: string) => void;
  setSharePostSheetRef: (ref: RefObject<BottomSheetMethods> | null) => void;
  sharePostSheetRef: RefObject<BottomSheetMethods> | null;
};

export const useSharePostStore = create<SharePostStore>((set) => ({
  postUUID: undefined,
  setPostUUID: (uuid) => set(() => ({ postUUID: uuid })),
  setSharePostSheetRef: (ref) => set({ sharePostSheetRef: ref }),
  sharePostSheetRef: null,
}));
