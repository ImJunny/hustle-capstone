import View from "@/components/ui/View";
import React from "react";
import Message from "@/components/messages/Message";
import { BackHeader, MessagesHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import { exampleMessages } from "@/server/utils/example-data";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { MessagePreview } from "@/server/actions/message-actions";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function MessagesScreen() {
  const { user } = useAuthData();

  const { data, isLoading } = trpc.messages.get_message_previews.useQuery({
    user_uuid: user?.id!,
  });

  if (isLoading || !data) {
    return (
      <LoadingScreen loads={[isLoading]} data={data} header={<BackHeader />} />
    );
  }

  return (
    <>
      <MessagesHeader />
      <ScrollView style={{ flex: 1 }} color="background">
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
