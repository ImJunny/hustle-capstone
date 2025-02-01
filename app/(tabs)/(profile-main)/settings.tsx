import { StyleSheet } from "react-native";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";

export default function TabTwoScreen() {
  return (
    <View style={styles.titleContainer}>
      <Text>Settings</Text>
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
