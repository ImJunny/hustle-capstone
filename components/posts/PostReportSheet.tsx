import Text from "../ui/Text";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { TColors } from "@/constants/Colors";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Icon, { IconSymbolName } from "../ui/Icon";
import Sheet from "../ui/Sheet";
import { RefObject, useEffect, useState } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { TFontSizes } from "@/constants/Sizes";
import { trpc } from "@/server/lib/trpc-client";
import { reportReasons } from "@/drizzle/db-types";
import Toast from "react-native-toast-message";
import { useAuthData } from "@/contexts/AuthContext";
import View from "../ui/View";
import Button from "../ui/Button";
import LoadingView from "../ui/LoadingView";

export default function PostReportSheet({
  sheetRef,
  uuid,
}: {
  sheetRef: RefObject<BottomSheetMethods>;
  uuid: string;
}) {
  const { user } = useAuthData();
  const { data, isLoading } = trpc.report.is_reported_post.useQuery({
    uuid: uuid,
    user_uuid: user?.id as string,
  });
  const [selected, setSelected] = useState<string>("");
  const [reported, setReported] = useState(data);

  useEffect(() => {
    if (data) {
      setReported(data);
    }
  }, [data]);

  const { mutate: report, isLoading: reportLoading } =
    trpc.report.report_post.useMutation({
      onSuccess: () => {
        Toast.show({
          text1: "Post reported",
        });
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
  const { mutate: undoReport, isLoading: undoLoading } =
    trpc.report.undo_report_post.useMutation({
      onSuccess: () => {
        Toast.show({
          text1: "Undid report",
        });
        setReported(false);
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error.message,
        });
      },
    });

  const handlePress = (reason: keyof typeof reportReasons) => {
    setSelected(reportReasons[reason]);
    report({
      uuid,
      reason,
      user_uuid: user?.id as string,
    });
    sheetRef.current?.forceClose();
  };

  const handleUndo = () => {
    undoReport({
      uuid,
      user_uuid: user?.id as string,
    });
  };

  return (
    <Sheet
      sheetRef={sheetRef}
      title="Report post"
      snapPoints={[1]}
      backdropOpacity={0.8}
    >
      <BottomSheetView style={{ padding: 16, flex: 1 }}>
        {isLoading ? (
          <LoadingView />
        ) : reported ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: 36,
              marginVertical: 40,
            }}
          >
            <Icon name="flag" size={50} />
            <View style={{ gap: 4, alignItems: "center" }}>
              <Text weight="semibold" size="xl">
                You reported this post
              </Text>
              <Text color="muted" size="sm" style={{ textAlign: "center" }}>
                We will look into this report as soon as possible. However, you
                can choose to undo this report.
              </Text>
            </View>

            <Button onPress={handleUndo} disabled={undoLoading}>
              Undo
            </Button>
          </View>
        ) : (
          <View style={{ gap: 20 }}>
            <Text size="sm" color="muted">
              Reporting this post will hide it from your feed. You can undo this
              report or view this post in the settings.
            </Text>
            {Object.entries(reportReasons).map(([key, value], i) => (
              <SheetOption
                key={i}
                text={value}
                onPress={() => handlePress(key as keyof typeof reportReasons)}
                isLoading={reportLoading}
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
