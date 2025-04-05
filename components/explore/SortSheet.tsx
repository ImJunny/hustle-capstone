import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import Sheet from "../ui/Sheet";
import { RefObject } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { TouchableOpacity } from "react-native";
import Text from "../ui/Text";
import { trpc } from "@/server/lib/trpc-client";
import { TColors } from "@/constants/Colors";
import Icon from "../ui/Icon";
import { router, useLocalSearchParams } from "expo-router";

export default function SortSheet({
  sheetRef,
}: {
  sheetRef: RefObject<BottomSheetMethods>;
}) {
  const utils = trpc.useUtils();
  const { sort } = useLocalSearchParams();

  function handleSort(
    type: "asc-rate" | "desc-rate" | "asc-dist" | "desc-dist" | "relevance"
  ) {
    router.setParams({
      sort: type,
    });

    utils.post.get_posts_by_filters.invalidate();
  }

  return (
    <Sheet sheetRef={sheetRef} title="Sort" snapPoints={[1, "35%"]}>
      <BottomSheetView style={{ padding: 16, gap: 16 }}>
        <SheetOption text="Relevance" type={"relevance"} />
        <SheetOption text="$ - Low to high" type="asc-rate" />
        <SheetOption text="$ - High to low" type="desc-rate" />
        <SheetOption text="Distance - Nearest" type="asc-dist" />
        <SheetOption text="Distance - Farthest" type="desc-dist" />
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
    type: "asc-rate" | "desc-rate" | "asc-dist" | "desc-dist" | "relevance";
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
        <Text size="lg" color={color}>
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
