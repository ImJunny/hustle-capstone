import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import Sheet from "../ui/Sheet";
import { Dispatch, RefObject, SetStateAction } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { TouchableOpacity } from "react-native";
import Text from "../ui/Text";
import { trpc } from "@/server/lib/trpc-client";
import { TColors } from "@/constants/Colors";
import Icon from "../ui/Icon";

export default function SortSheet({
  sheetRef,
  sort,
  setSort,
}: {
  sheetRef: RefObject<BottomSheetMethods>;
  sort: "asc" | "desc" | undefined;
  setSort: Dispatch<SetStateAction<"asc" | "desc" | undefined>>;
}) {
  const utils = trpc.useUtils();

  function handleSort(type: "asc" | "desc" | undefined) {
    setSort(type);
    utils.post.get_posts_by_filters.invalidate();
  }

  return (
    <Sheet sheetRef={sheetRef} title="Sort" snapPoints={[1, "35%"]}>
      <BottomSheetView style={{ padding: 16, gap: 16 }}>
        <SheetOption text="Relevance" type={undefined} />
        <SheetOption text="$ - Low to high" type="asc" />
        <SheetOption text="$ - High to low" type="desc" />
      </BottomSheetView>
    </Sheet>
  );

  function SheetOption({
    text,
    color,
    type,
  }: {
    text: string;
    color?: TColors;
    type: "asc" | "desc" | undefined;
  }) {
    return (
      <TouchableOpacity
        onPress={() => handleSort(type)}
        style={{
          flexDirection: "row",
          gap: 16,
          alignItems: "center",
          height: 26,
        }}
      >
        <Text size="xl" color={color}>
          {text}
        </Text>
        {sort === type && (
          <Icon
            name="checkmark-outline"
            size="xl"
            color={color}
            style={{ marginLeft: "auto" }}
          />
        )}
      </TouchableOpacity>
    );
  }
}
