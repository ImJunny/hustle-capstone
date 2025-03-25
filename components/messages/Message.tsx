import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import View, { ViewProps } from "../ui/View";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { TMessage } from "@/server/utils/example-data";
import { router } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import { MessagePreview } from "@/server/actions/message-actions";

type MessageProps = {
  data: MessagePreview;
} & ViewProps;

export default function Message({ data }: MessageProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;

  return (
    <TouchableOpacity
      onPress={() =>
        router.push(`/message/${data.receiver_display_name} ` as any)
      }
    >
      <View style={[styles.entry, { borderColor }]} color="background">
        <Image
          source={
            data?.receiver_avatar_url
              ? {
                  uri: data.receiver_avatar_url,
                }
              : require("@/assets/images/default-avatar-icon.jpg")
          }
          style={{ borderRadius: 999, width: 50, height: 50 }}
        />
        <View style={styles.entryContent}>
          <Text size="lg" weight="bold" style={styles.title}>
            {data.receiver_display_name}
          </Text>
          <Text
            size="md"
            weight="normal"
            color="foreground"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.title}
          >
            {data.last_message}
          </Text>
          <Text size="sm" weight="normal" color="muted" style={styles.title}>
            {/* {formatDistanceToNow(new Date(data.last_message_at!))} */}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
