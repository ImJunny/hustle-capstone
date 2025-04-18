import Text from "../ui/Text";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { TColors } from "@/constants/Colors";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { router } from "expo-router";
import Icon, { IconSymbolName } from "../ui/Icon";
import Sheet from "../ui/Sheet";
import { Dispatch, RefObject, SetStateAction } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { TFontSizes } from "@/constants/Sizes";

export default function PostDetailsSheet({
  isSelf,
  sheetRef,
  reportSheetRef,
  uuid,
  setModalOpen,
}: {
  isSelf: boolean;
  sheetRef: RefObject<BottomSheetMethods>;
  reportSheetRef: RefObject<BottomSheetMethods>;
  uuid: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const handleEdit = () => {
    sheetRef.current?.forceClose();
    router.push(`/edit-post/${uuid}`);
  };

  const handleDelete = () => {
    sheetRef.current?.forceClose();
    setModalOpen(true);
  };

  const handleReport = () => {
    sheetRef.current?.forceClose();
    reportSheetRef.current?.expand();
  };

  return (
    <Sheet
      sheetRef={sheetRef}
      title="Post options"
      snapPoints={[1, "35%"]}
      backdropOpacity={0.1}
    >
      <BottomSheetView style={{ padding: 16, gap: 16 }}>
        {isSelf ? (
          <>
            <SheetOption
              text="Edit post"
              name="create-outline"
              onPress={handleEdit}
            />
            <SheetOption
              text="Delete post"
              name="trash-outline"
              color="red"
              onPress={handleDelete}
            />
          </>
        ) : (
          <SheetOption
            text="Report post"
            name="flag-outline"
            color="red"
            onPress={handleReport}
          />
        )}
      </BottomSheetView>
    </Sheet>
  );
}
function SheetOption({
  text,
  color,
  onPress,
  name,
  disabled,
  textSize,
}: {
  text: string;
  color?: TColors;
  name?: IconSymbolName;
  textSize?: TFontSizes;
} & TouchableOpacityProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
      }}
      disabled={disabled}
    >
      {name && <Icon name={name} size="xl" color={color} />}
      <Text size={textSize ?? "lg"} color={color}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
