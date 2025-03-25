import React from "react";
import { useLocalSearchParams } from "expo-router";
import View from "@/components/ui/View";
import ScrollView from "@/components/ui/ScrollView";
import {
  SingleMessageFooter,
  SingleMessageHeader,
} from "@/components/headers/Headers";
import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import { useAuthData } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { format, isToday, isThisYear } from "date-fns";
import { trpc } from "@/server/lib/trpc-client";
import LoadingView from "@/components/ui/LoadingView";

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  // Check if the date is today or in the current year using date-fns
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  if (isToday(date)) {
    return format(date, "p"); // Only show time if today
  } else if (isThisYear(date)) {
    return format(date, "MMM dd, p"); // Show date without year (e.g., "Mar 23, 2:30 PM")
  } else {
    return format(date, "MMM dd, yyyy, p"); // Show date with year (e.g., "Mar 23, 2022, 2:30 PM")
  }
};

export default function MessageScreen() {
  const { uuid } = useLocalSearchParams();

  const { user } = useAuthData();
  if (!user) return;
  const { data, isLoading } = trpc.messages.get_chat_info.useQuery({
    sender_uuid: user.id as string,
    receiver_uuid: uuid as string,
  });
  const themeColor = useThemeColor();

  if (isLoading) {
    return <LoadingView />;
  } else if (!data) {
    return (
      <>
        <Text>Chat not found</Text>
      </>
    );
  }

  return (
    <>
      <SingleMessageHeader
        avatarUrl={data.avatar_url}
        messenger={`@${data.receiver_info.receiver_username}`}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={{ flex: 1 }}
        color="base"
      >
        <View style={styles.messageContainer}>
          {data.chats.map((chat, index) => {
            const formattedTimestamp = formatTimestamp(chat.timestamp);

            return (
              <View key={index} style={styles.messageWrapper}>
                <Text style={styles.timestampText} color="muted" size="sm">
                  {formattedTimestamp}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    alignSelf:
                      chat.type === "sender" ? "flex-end" : "flex-start",
                  }}
                >
                  {chat.type === "receiver" && (
                    <View
                      style={{
                        borderBottomWidth: 8,
                        borderLeftWidth: 6,
                        width: 0,
                        height: 0,
                        marginRight: -0.5,
                        borderBottomColor:
                          chat.type === "sender"
                            ? themeColor.foreground
                            : themeColor["background-variant"],
                      }}
                    />
                  )}
                  <View
                    style={[
                      styles.message,
                      chat.type === "sender"
                        ? styles.sentMessage
                        : styles.receivedMessage,
                    ]}
                    color={
                      chat.type === "sender"
                        ? "foreground"
                        : "background-variant"
                    }
                  >
                    <Text
                      size="lg"
                      color={
                        chat.type === "sender" ? "background" : "foreground"
                      }
                    >
                      {chat.message}
                    </Text>
                  </View>
                  {chat.type === "sender" && (
                    <View
                      style={{
                        borderBottomWidth: 8,
                        borderRightWidth: 6,
                        width: 0,
                        height: 0,
                        marginLeft: -0.5,
                        borderBottomColor:
                          chat.type === "sender"
                            ? themeColor.foreground
                            : themeColor["background-variant"],
                      }}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <SingleMessageFooter
        sender_uuid={user.id}
        receiver_uuid={data.receiver_info.receiver_uuid}
      />
    </>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 16,
    gap: 20,
  },
  messageWrapper: {
    alignItems: "center",
  },
  message: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 300,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  sentMessage: {
    alignSelf: "flex-end",
    borderBottomLeftRadius: 10,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    borderBottomRightRadius: 10,
  },
  timestampText: {
    marginBottom: 6,
    textAlign: "center",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});
