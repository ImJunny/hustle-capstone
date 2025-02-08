import React from "react";
import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import { useThemeColor } from "@/hooks/useThemeColor";
import View, { ViewProps } from "../ui/View";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { TMessage } from "@/server/utils/example_data";

type MessageProps = {
  data: TMessage;
} & ViewProps;

export default function Message({ data }: MessageProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const { last_message, message, messenger, uuid, is_job } = data;

  return (
    <View style={[styles.entry, { borderColor }]} color="background">
      <View
        style={{ borderRadius: 999, width: 50, height: 50 }}
        color="muted"
      />
      <View style={styles.entryContent}>
        <Text size="lg" weight="bold" color="foreground" style={styles.title}>
          {messenger}
        </Text>
        <Text
          size="md"
          weight="normal"
          color="foreground"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.title}
        >
          {message}
        </Text>
        <Text size="sm" weight="normal" color="muted" style={styles.title}>
          {last_message}
        </Text>
      </View>
      {is_job && (
        <ImagePlaceholder width={70} height={70} style={styles.entryImage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    alignItems: "center",
    height: 84,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  entryImage: {
    marginLeft: 12,
    borderRadius: 4,
  },
  entryContent: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 8,
  },
  title: {
    paddingHorizontal: 10,
  },
});
