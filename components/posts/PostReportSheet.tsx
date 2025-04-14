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
import { report_reasons } from "@/drizzle/db-types";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useAuthData } from "@/contexts/AuthContext";
import View from "../ui/View";
import Button from "../ui/Button";

export default function PostReportSheet({
  sheetRef,
  uuid,
}: {
  sheetRef: RefObject<BottomSheetMethods>;
  uuid: string;
}) {
  const [selected, setSelected] = useState<string>("");
  const [reported, setReported] = useState(false);
  const { user } = useAuthData();
  const { mutate: report, isLoading } = trpc.post.report_post.useMutation({
    onSuccess: () => {
      setReported(true);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    },
    onSettled: () => {
      setSelected("");
    },
  });

  const handlePress = (reason: keyof typeof report_reasons) => {
    setSelected(report_reasons[reason]);
    report({
      uuid,
      reason,
      user_uuid: user?.id as string,
    });
  };

  return (
    <Sheet
      sheetRef={sheetRef}
      title="Report post"
      snapPoints={[1, "60%"]}
      backdropOpacity={0.8}
    >
      <BottomSheetView style={{ padding: 16, flex: 1 }}>
        {reported ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: 36,
            }}
          >
            <Icon name="flag" size={50} style={{ marginTop: 40 }} />
            <View style={{ gap: 4, alignItems: "center" }}>
              <Text weight="semibold" size="xl">
                You reported this post
              </Text>
              <Text color="muted" size="sm" style={{ textAlign: "center" }}>
                We will look into this report as soon as possible. However, you
                can choose to undo this report.
              </Text>
            </View>

            <Button>Undo</Button>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            <Text size="sm" color="muted">
              Reporting this post will hide it from your feed. You can undo this
              report or view this post in the settings.
            </Text>
            {Object.entries(report_reasons).map(([key, value], i) => (
              <SheetOption
                key={i}
                text={value}
                onPress={() => handlePress(key as keyof typeof report_reasons)}
                isLoading={isLoading}
                selected={selected}
              />
            ))}
          </View>
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
  textSize,
  isLoading,
  selected,
}: {
  text: string;
  color?: TColors;
  name?: IconSymbolName;
  isLoading?: boolean;
  textSize?: TFontSizes;
  selected: string;
} & TouchableOpacityProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        opacity: selected === text ? 0.5 : 1,
        gap: 16,
        alignItems: "center",
      }}
      disabled={isLoading}
    >
      {name && <Icon name={name} size="xl" color={color} />}
      <Text size={textSize ?? "lg"} color={color}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
