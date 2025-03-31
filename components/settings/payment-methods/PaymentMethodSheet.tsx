import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { TColors } from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { Dispatch, RefObject, SetStateAction } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import Sheet from "@/components/ui/Sheet";
import Icon, { IconSymbolName } from "@/components/ui/Icon";
import Text from "@/components/ui/Text";
import { router } from "expo-router";

export default function ({
  uuid,
  sheetRef,
  setModalOpen,
}: {
  uuid: string;
  sheetRef: RefObject<BottomSheetMethods>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Sheet sheetRef={sheetRef} title="Payment options" snapPoints={[1, "35%"]}>
      <BottomSheetView style={{ padding: 16, gap: 16 }}>
        <SheetOption
          text="Delete Payment"
          name="trash-outline"
          color="red"
          onPress={() => {
            sheetRef.current?.close();
            setModalOpen(true);
          }}
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
