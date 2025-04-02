import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import Text from "@/components/ui/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import View, { ViewProps } from "../ui/View";
import { router } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import { MessagePreview } from "@/server/actions/message-actions";
import { useAuthData } from "@/contexts/AuthContext";

type MessageProps = {
  data: MessagePreview;
} & ViewProps;

export default function Message({ data }: MessageProps) {
  const { user } = useAuthData();
  const themeColor = useThemeColor();
  const borderColor = themeColor.border;
  const formattedTime = formatDistanceToNow(
    new Date(data.last_message_timestamp)
  );

  const isHighlighted =
    (data.is_read && data.last_message_receiver_uuid === user?.id) ||
    data.last_message_receiver_uuid !== user?.id;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/message/${data.receiver_uuid} ` as any)}
    >
      <View
        style={[styles.entry, { borderColor }]}
        color={isHighlighted ? "background" : "base"}
      >
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
        {!isHighlighted ? (
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
