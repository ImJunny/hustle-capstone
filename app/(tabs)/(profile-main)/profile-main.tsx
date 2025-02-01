import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";
import { router } from "expo-router";
import Button from "@/components/ui/Button";

export default function TabTwoScreen() {
  return (
    <View style={styles.titleContainer}>
      <Text>Profile</Text>
      <Button onPress={() => router.push("/settings")}>Profile Main</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    marginTop: 100,
    flexDirection: "row",
    gap: 8,
  },
});
