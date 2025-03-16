import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { TColors } from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { RefObject } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import Sheet from "@/components/ui/Sheet";
import Icon, { IconSymbolName } from "@/components/ui/Icon";
import Text from "@/components/ui/Text";

export default function ({
  uuid,
  sheetRef,
}: {
  uuid: string;
  sheetRef: RefObject<BottomSheetMethods>;
}) {
  return (
    <Sheet sheetRef={sheetRef} title="Address options" snapPoints={[1, "35%"]}>
      <BottomSheetView style={{ padding: 16, gap: 16 }}>
        <SheetOption
          text="Edit address"
          name="create-outline"
          onPress={() => {}}
        />
        <SheetOption
          text="Delete address"
          name="trash-outline"
          color="red"
          onPress={() => {}}
        />
      </BottomSheetView>
    </Sheet>
  );
}

function SheetOption({
  text,
  onPress,
  name,
  color,
}: {
  text: string;
  onPress: () => void;
  name?: IconSymbolName;
  color?: TColors;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
      }}
    >
      {name && <Icon name={name} size="xl" color={color} />}
      <Text size="lg" color={color}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
