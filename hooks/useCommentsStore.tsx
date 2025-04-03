import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { RefObject } from "react";
import { create } from "zustand";

type CommentsStore = {
  postUUID: string | undefined;
  setPostUUID: (uuid: string) => void;
  setCommentsSheetRef: (ref: RefObject<BottomSheetMethods>) => void;
  commentsSheetRef: RefObject<BottomSheetMethods> | null;
};

export const useCommentsStore = create<CommentsStore>((set) => ({
  postUUID: undefined,
  setPostUUID: (uuid) => set(() => ({ postUUID: uuid })),
  setCommentsSheetRef: (ref) => set({ commentsSheetRef: ref }),
  commentsSheetRef: null,
}));
