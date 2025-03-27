import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import React from "react";
import Input from "@/components/ui/Input";
import Message from "@/components/messages/Message";
import { MessagesHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import { exampleMessages } from "@/server/utils/example-data";
import { router } from "expo-router";
import {
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import LoadingView from "@/components/ui/LoadingView";
import { MessagePreview } from "@/server/actions/message-actions";

export default function MessagesScreen() {
  const { user } = useAuthData();
  if (!user) {
    return (
      <>
        <MessagesHeader />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No User found</Text>
        </View>
      </>
    );
  }

  const { data, isLoading } = trpc.messages.get_message_previews.useQuery({
    user_uuid: user.id,
  });

  if (isLoading) {
    return <LoadingView />;
  } else if (!data) {
    return (
      <>
        <MessagesHeader />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No messages yet</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <MessagesHeader />
      <ScrollView style={{ flex: 1 }} color="base">
        <View>
          {data.map((message, i) => (
            <Message
              key={i}
              data={message as unknown as MessagePreview}
              style={{
                borderBottomWidth: i != exampleMessages.length - 1 ? 1 : 0,
              }}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
}
