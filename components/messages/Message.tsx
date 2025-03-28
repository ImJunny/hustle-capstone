import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import View, { ViewProps } from "../ui/View";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { TMessage } from "@/server/utils/example-data";
import { router } from "expo-router";
import { formatDistanceStrict, formatDistanceToNow } from "date-fns";
import { MessagePreview } from "@/server/actions/message-actions";

type MessageProps = {
  data: MessagePreview;
} & ViewProps;

export default function Message({ data }: MessageProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const formattedTime = formatDistanceToNow(
    new Date(data.last_message_timestamp)
  );

  return (
    <TouchableOpacity
      onPress={() => router.push(`/message/${data.receiver_uuid} ` as any)}
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
          style={{ borderRadius: 999, width: 60, height: 60 }}
        />
        <View style={styles.entryContent}>
          <Text size="lg" weight="bold">
            {data.receiver_display_name}
          </Text>
          <Text
            size="md"
            weight="normal"
            color="foreground"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data.last_message}
          </Text>
          <Text
            size="sm"
            weight="normal"
            color="muted"
            style={{ marginTop: 8 }}
          >
            {formattedTime} ago
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
    borderBottomWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 16,
  },
  entryImage: {
    marginLeft: 12,
    borderRadius: 4,
  },
  entryContent: {
    flex: 1,
  },
});
