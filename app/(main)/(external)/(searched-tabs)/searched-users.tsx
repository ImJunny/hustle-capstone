import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import Icon from "@/components/ui/Icon";
import { exampleJobPosts, exampleMessages } from "@/server/utils/example_data";
import Message from "@/components/messages/Message";
import ScrollView from "@/components/ui/ScrollView";

export default function searchedUsers() {
  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      color="base"
    >
      <View>
        <View style={styles.container}>
          <View style={styles.spacing}>
            <Icon name="heart-sharp" size="lg" />
          </View>
          <View style={styles.spacing}>
            <Text size="lg" style={{ marginRight: 80 }}>
              Save this search
            </Text>
          </View>
          <View style={styles.spacing}>
            <Text size="lg">Sort</Text>
          </View>
          <View style={styles.spacing}>
            <Icon
              name="swap-vertical-outline"
              size="lg"
              style={{ marginRight: 20 }}
            />
          </View>
          <View style={styles.spacing}>
            <Text size="lg">Filter</Text>
          </View>
          <View style={styles.spacing}>
            <Icon name="filter" size="lg" />
          </View>
        </View>
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
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 12,
    borderWidth: 1,
    borderBottomColor: "#272727",
  },
  spacing: {
    padding: 5,
  },
});
