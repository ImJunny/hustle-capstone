import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import View from "@/components/ui/View";
import ScrollView from "@/components/ui/ScrollView";
import {
  SingleMessageFooter,
  SingleMessageHeader,
} from "@/components/headers/Headers";
import { ScrollView as RNScrollView, StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import { useAuthData } from "@/contexts/AuthContext";
import { format, isToday, isThisYear } from "date-fns";
import { trpc } from "@/server/lib/trpc-client";
import LoadingView from "@/components/ui/LoadingView";
import { supabase } from "@/server/lib/supabase";
import { useMessageStore } from "@/hooks/useMessageStore";

// Format timestamp for display
const formatTimestamp = (timestamp: string) => {
  return format(timestamp, "p");
};

const formatDate = (date: string) => {
  return isToday(date)
    ? `Today, ${format(date, "MMMM d")}`
    : isThisYear(date)
    ? format(date, "MMM d")
    : format(date, "MMM d, yyyy");
};

// Group messages by day
const groupMessagesByDate = (messages: any[]) => {
  return messages.reduce((groups: any, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});
};

export default function MessageScreen() {
  const { uuid } = useLocalSearchParams();
  const { user } = useAuthData();
  const utils = trpc.useUtils();
  if (!user) return;

  const { data, isLoading } = trpc.messages.get_chat_info.useQuery({
    sender_uuid: user.id as string,
    receiver_uuid: uuid as string,
  });

  const { mutate: markAsRead } = trpc.messages.mark_as_read.useMutation({
    onSuccess: () => {
      utils.messages.get_chat_info.invalidate();
    },
  });

  const [groupedMessages, setGroupedMessages] = useState<any>({});
  const addReadChat = useMessageStore((state) => state.addReadChat);
  // Supabase Realtime
  const channelName = [user.id, uuid].sort().join(".");
  const channel = useMemo(() => supabase.channel(channelName), [channelName]);

  useEffect(() => {
    if (data) {
      const grouped = groupMessagesByDate(data.chats);
      setGroupedMessages(grouped);
    }
    if (data?.receiver_info.receiver_uuid && data.chats.length > 0) {
      addReadChat(data.chats[data.chats.length - 1].message_uuid);
      markAsRead({
        sender_uuid: user.id,
        receiver_uuid: data?.receiver_info.receiver_uuid,
      });
    }
  }, [data]);

  useEffect(() => {
    channel.on("broadcast", { event: "message" }, (payload) => {
      const newMessage = payload.payload;
      setGroupedMessages((prev: any) => {
        const updatedMessages = { ...prev };
        const date = formatDate(newMessage.timestamp);

        if (!updatedMessages[date]) updatedMessages[date] = [];
        updatedMessages[date].push(newMessage);
        return updatedMessages;
      });

      if (data?.receiver_info.receiver_uuid && data.chats.length > 0) {
        addReadChat(data.chats[data.chats.length - 1].message_uuid);
        markAsRead({
          sender_uuid: user.id,
          receiver_uuid: data?.receiver_info.receiver_uuid,
        });
      }
    });

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [channel]);

  const scrollViewRef = useRef<RNScrollView>(null);

  const [isLayoutDone, setIsLayoutDone] = useState(false);

  const onLayout = () => {
    setIsLayoutDone(true);
  };
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, [groupedMessages, isLayoutDone]);

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
        user_uuid={data.receiver_info.receiver_uuid}
      />
      <ScrollView
        style={{ flex: 1 }}
        color="background"
        ref={scrollViewRef}
        onLayout={onLayout}
      >
        <View style={styles.messageContainer}>
          {Object.keys(groupedMessages).map((date) => (
            <View key={date}>
              <Text
                style={{
                  textAlign: "center",
                  marginVertical: 44,
                  marginTop: 44,
                }}
                color="muted"
                size="sm"
              >
                {date}
              </Text>

              <View style={{ gap: 20 }}>
                {groupedMessages[date].map((message: any, index: number) => {
                  const formattedTimestamp = formatTimestamp(message.timestamp);

                  return (
                    <View key={index}>
                      <View
                        style={{
                          flexDirection:
                            message.sender_uuid === user.id
                              ? "row-reverse"
                              : "row",
                          gap: 12,
                          alignItems: "flex-end",

                          alignSelf:
                            message.sender_uuid === user.id
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        <View
                          style={[styles.message]}
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
                        <Text color="muted" size="sm">
                          {formattedTimestamp}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  message: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: "75%",
    borderRadius: 999,
  },
});
