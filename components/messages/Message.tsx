import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import View, { ViewProps } from "../ui/View";
import { router } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import { MessagePreview } from "@/server/actions/message-actions";
import { useMessageStore } from "@/hooks/useMessageStore";
import AvatarImage from "../ui/AvatarImage";
import Icon from "../ui/Icon";

type MessageProps = {
  data: MessagePreview;
} & ViewProps;

export default function Message({ data }: MessageProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const formattedTime = formatDistanceToNow(
    new Date(data.last_message_timestamp)
  );
  const isRead = useMessageStore((state) =>
    state.isReadChat(data.last_message_uuid)
  );
  return (
    <TouchableOpacity
      onPress={() => router.push(`/message/${data.receiver_uuid} ` as any)}
    >
      <View
        style={[styles.entry, { borderColor }]}
        color={isRead ? "background" : "base"}
      >
        <AvatarImage url={data.receiver_avatar_url} size={60} />
        <View style={styles.entryContent}>
          <Text size="lg" weight="bold">
            {data.receiver_display_name}
          </Text>
          {data.last_message_type === "text" ? (
            <Text
              size="md"
              weight={!isRead ? "bold" : "normal"}
              color="foreground"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {data.last_message}
            </Text>
          ) : data.last_message_type === "post" ? (
            <View
              style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
            >
              <Icon name="image" />
              <Text
                size="md"
                weight={!isRead ? "bold" : "normal"}
                color="foreground"
                style={{ fontStyle: "italic" }}
              >
                Post
              </Text>
            </View>
          ) : null}

          <Text
            size="sm"
            weight="normal"
            color="muted"
            style={{ marginTop: 8 }}
          >
            {formattedTime} ago
          </Text>
        </View>
        {!isRead ? (
          <Text size="4xl" style={{ paddingLeft: 16, paddingRight: 8 }}>
            •
          </Text>
        ) : null}
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
