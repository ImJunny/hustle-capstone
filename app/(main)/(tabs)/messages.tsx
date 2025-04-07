import View from "@/components/ui/View";
import React, { useEffect } from "react";
import Message from "@/components/messages/Message";
import { BackHeader, MessagesHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import { exampleMessages } from "@/server/utils/example-data";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { MessagePreview } from "@/server/actions/message-actions";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useMessageStore } from "@/hooks/useMessageStore";
import { useStore } from "zustand";

export default function MessagesScreen() {
  const { user } = useAuthData();

  const { data, isLoading, refetch } =
    trpc.messages.get_message_previews.useQuery({
      user_uuid: user?.id!,
    });

  const addReadChat = useMessageStore((state) => state.addReadChat);
  useEffect(() => {
    if (data) {
      data.forEach((chat) => {
        if (
          (chat.is_read && chat.last_message_receiver_uuid === user?.id) ||
          chat.last_message_receiver_uuid !== user?.id
        ) {
          addReadChat(chat.last_message_uuid);
        }
      });
      useMessageStore.setState({ fetchedChats: true });
    }
  }, [data]);

  const fetchedChats = useMessageStore((state) => state.fetchedChats);

  if (isLoading || !data || !fetchedChats) {
    return (
      <LoadingScreen
        loads={[isLoading, !fetchedChats]}
        data={data}
        header={<BackHeader />}
      />
    );
  }

  return (
    <>
      <MessagesHeader />
      <ScrollView style={{ flex: 1 }} color="background" refetch={refetch}>
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
