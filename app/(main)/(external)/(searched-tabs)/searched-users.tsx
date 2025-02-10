import React from "react";
import { exampleMessages } from "@/server/utils/example_data";
import Message from "@/components/messages/Message";
import ScrollView from "@/components/ui/ScrollView";
import ExploreMiniHeader from "@/components/explore/ExploreMiniHeader";

export default function searchedUsers() {
  return (
    <>
      <ExploreMiniHeader />
      <ScrollView>
        {exampleMessages.map((message, i) => (
          <Message
            key={i}
            data={message}
            style={{
              borderBottomWidth: i != exampleMessages.length - 1 ? 1 : 0,
            }}
          />
))}
