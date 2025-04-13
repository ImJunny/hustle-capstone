import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetHandleProps,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";
import View from "../ui/View";
import Text from "../ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BackHandler, ViewStyle } from "react-native";
import { ReactNode, useCallback, useEffect, useState } from "react";
import IconButton from "../ui/IconButton";
import { Keyboard } from "react-native";

export default function Sheet({
  title,
  sheetRef,
  children,
  snapPoints,
  handleComponent,
  backdrop = true,
  ...props
}: {
  title?: string;
  sheetRef: React.RefObject<BottomSheetMethods>;
  children: ReactNode;
  backdrop?: boolean;
} & BottomSheetProps) {
  const themeColor = useThemeColor();

  const renderBackdrop = useCallback(
    (props: any) =>
      backdrop && (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.4}
          pointerEvents="auto"
          pressBehavior="close"
        />
      ),
    []
  );

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSheetChange = (index: number) => {
    setIsSheetOpen(index > 0);
    if (index < 1) {
      sheetRef.current?.close();
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isSheetOpen) {
          sheetRef.current?.close();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [isSheetOpen]);

  const HandleComponent: React.FC<BottomSheetHandleProps> = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: themeColor.border,
      }}
    >
      <Text size="xl" weight="semibold">
        {title}
      </Text>
      <IconButton
        name="close-outline"
        size="2xl"
        onPress={() => {
          sheetRef.current?.close();
          Keyboard.dismiss();
        }}
      />
    </View>
  );

  return (
    <BottomSheet
      ref={sheetRef}
      onChange={handleSheetChange}
      index={-1}
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: themeColor.background,
        borderRadius: 0,
        borderTopWidth: 1,
        borderColor: themeColor.border,
      }}
      handleComponent={handleComponent ?? HandleComponent}
      handleIndicatorStyle={{
        backgroundColor: themeColor["background-variant"],
      }}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      {...props}
    >
      {children}
    </BottomSheet>
  );
}
