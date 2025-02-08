import View from "@/components/ui/View";
import React from "react";
import Input from "@/components/ui/Input";
import { StyleSheet, Dimensions } from "react-native";
import Message from "@/components/messages/Message";
import { EmptyHeader } from "@/components/headers/Headers";

const { height } = Dimensions.get("window");
const contentHeight = height * 0.8; // 80% of the screen height

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
      <EmptyHeader />
      <View>
        <View style={styles.search_container}>
          <Input placeholder="Search in messages..."></Input>
        </View>
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search_container: {
    padding: 10,
  },
  messages_container: {},
});
