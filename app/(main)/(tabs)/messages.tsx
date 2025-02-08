import View from "@/components/ui/View";
import React from "react";
import Input from "@/components/ui/Input";
import { StyleSheet } from "react-native";
import Message from "@/components/messages/Message";
import { MessagesHeader } from "@/components/headers/Headers";
import ScrollView from "@/components/ui/ScrollView";

const inbox = [
  {
    id: 1,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    num_of_new_mes: 1,
    last_message: "5 weeks ago",
    messenger: "Kevin Li",
  },
  {
    id: 2,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    num_of_new_mes: 0,
    last_message: "5 weeks ago",
    messenger: "Kevin Li",
  },
  {
    id: 3,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    num_of_new_mes: 0,
    last_message: "5 weeks ago",
    messenger: "Kevin Li",
  },
  {
    id: 4,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    num_of_new_mes: 0,
    last_message: "5 weeks ago",
    messenger: "Kevin Li",
  },
  {
    id: 5,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...",
    num_of_new_mes: 0,
    last_message: "5 weeks ago",
    messenger: "Kevin Li",
  },
];

export default function MessagesScreen() {
  return (
    <>
      <MessagesHeader />
      <ScrollView style={{ flex: 1 }} color="base">
        <View>
          {inbox.map((message, i) => (
            <Message
              key={i}
              messenger={message.messenger}
              num_of_new_mes={message.num_of_new_mes}
              message={message.message}
              last_message={message.last_message}
              style={{
                borderBottomWidth: i != inbox.length - 1 ? 1 : 0,
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
