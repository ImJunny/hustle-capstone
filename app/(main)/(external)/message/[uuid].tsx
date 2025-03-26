import React, { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import View from "@/components/ui/View";
import ScrollView from "@/components/ui/ScrollView";
import {
  SingleMessageFooter,
  SingleMessageHeader,
} from "@/components/headers/Headers";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import { useAuthData } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { format, isToday, isThisYear } from "date-fns";
import { trpc } from "@/server/lib/trpc-client";
import LoadingView from "@/components/ui/LoadingView";
import { supabase } from "@/server/lib/supabase";
import { Platform } from "react-native";

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

  const [messages, setMessages] = useState<
    {
      sender_uuid: string;
      chat_type: string;
      message: string;
      timestamp: string;
    }[]
  >([]);

  // Supabase Realtime
  const channelName = [user.id, uuid].sort().join(".");
  const channel = useMemo(() => supabase.channel(channelName), [channelName]);

  useEffect(() => {
    if (data) setMessages(data.chats);
  }, [data]);

  useEffect(() => {
    channel.on("broadcast", { event: "message" }, (payload) => {
      setMessages((prev: any) => [...prev, payload.payload]);
    });

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [channel]);

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
        color="background"
      >
        <View style={styles.messageContainer}>
          {messages.map((message, index) => {
            const formattedTimestamp = formatTimestamp(message.timestamp);

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
                      message.sender_uuid === user.id
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <View
                    style={[
                      styles.message,
                      message.sender_uuid === user.id
                        ? styles.sentMessage
                        : styles.receivedMessage,
                    ]}
                    color={
                      message.sender_uuid === user.id
                        ? "foreground"
                        : "background-variant"
                    }
                  >
                    <Text
                      size="md"
                      color={
                        message.sender_uuid === user.id
                          ? "background"
                          : "foreground"
                      }
                    >
                      {message.message}
                    </Text>
                  </View>
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
