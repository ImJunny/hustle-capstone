import View from "@/components/ui/View";
import React from "react";
import Input from "@/components/ui/Input";
import { StyleSheet } from "react-native";
import Message from "@/components/messages/Message";
import { MessagesHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";
import { exampleMessages } from "@/server/utils/example_data";

export default function MessagesScreen() {
  return (
    <>
      <MessagesHeader />
      <ScrollView style={{ flex: 1 }} color="base">
        <View>
          {exampleMessages.map((message, i) => (
            <Message
              key={i}
              data={message}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
