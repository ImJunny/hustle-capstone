import React from "react";
import { useLocalSearchParams } from "expo-router";
import View from "@/components/ui/View";
import ScrollView from "@/components/ui/ScrollView";
import { SingleMessageHeader } from "@/components/headers/Headers";
import { Dimensions, StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import { exampleMessages } from "@/server/utils/example-data";
import { useAuthData } from "@/contexts/AuthContext";

export default function MessageScreen() {
  const { id } = useLocalSearchParams(); // Get the uuid from the URL query params
  const msg = exampleMessages.find((msg) => msg.uuid === id);

  if (!msg) {
    return <Text>{id} Message not found</Text>;
  }

  return (
      <>
        <SingleMessageHeader/>
        <View style={{ flex: 1 }} color="background">
          <ScrollView>
          <View style={styles.messageContainer}>
            {msg.messageHistory.map((history, index) => (
              <View
                key={index}
                style={[
                  styles.messageWrapper,
                  history.sent ? styles.sentMessage : styles.receivedMessage,
                ]}
              >
                <Text style={styles.messageText}>{history.message}</Text>
                <Text style={styles.timestampText}>
                  {history.date} - {history.timestamp}
                </Text>
              </View>
            ))}
          </View>
          </ScrollView>
        </View>
      </>
    );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 10,
    maxWidth: "80%",
  },
  sentMessage: {
    alignSelf: "flex-end", // Position sent messages on the right
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
  },
  receivedMessage: {
    alignSelf: "flex-start", // Position received messages on the left
    backgroundColor: "#E5E5E5",
    padding: 10,
    borderRadius: 10,
  },
  messageText: {
    color: "#fff",
    fontSize: 14,
  },
  timestampText: {
    fontSize: 10,
    color: "#aaa",
    textAlign: "right",
  },
});
