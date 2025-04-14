import Text from "../ui/Text";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { TColors } from "@/constants/Colors";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Icon, { IconSymbolName } from "../ui/Icon";
import Sheet from "../ui/Sheet";
import { RefObject, useState } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { TFontSizes } from "@/constants/Sizes";
import { trpc } from "@/server/lib/trpc-client";
import { report_reasons } from "@/constants/Data";

export default function PostReportSheet({
  sheetRef,
  uuid,
}: {
  sheetRef: RefObject<BottomSheetMethods>;
  uuid: string;
}) {
  const handlePress = (reason: keyof typeof report_reasons) => {
    console.log(reason);
  };

  return (
    <Sheet
      sheetRef={sheetRef}
      title="Report post"
      snapPoints={[1, "35%"]}
      backdropOpacity={0.1}
    >
      <BottomSheetView style={{ padding: 16, gap: 16 }}>
        {}
        <SheetOption
          text="Offensive"
          onPress={() => handlePress("offensive")}
        />
        <SheetOption text="Spam" onPress={() => handlePress("spam")} />
        <SheetOption
          text="Scam or fraud"
          onPress={() => handlePress("fraud")}
        />
        <SheetOption text="Violence" onPress={() => handlePress("violence")} />
        <SheetOption
          text="Nudity or sexual content"
          onPress={() => handlePress("sexual")}
        />
        <SheetOption text="Other" onPress={() => handlePress("other")} />
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
