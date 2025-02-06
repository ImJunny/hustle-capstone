import React from "react";
import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import ImageBackgroundPlaceholder from "@/components/ui/ImageBackgroundPlaceholder";
import { useThemeColor } from "@/hooks/useThemeColor";
import View, { ViewProps } from "../ui/View";

type MessageProps = {
  message: string;
  num_of_new_mes: number;
  last_message: string;
  messenger: string;
} & ViewProps;

export default function Message({
  message,
  num_of_new_mes,
  last_message,
  messenger,
}: MessageProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

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
      <ImageBackgroundPlaceholder
        width={70}
        height={70}
        style={styles.entryImage}
      />
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
