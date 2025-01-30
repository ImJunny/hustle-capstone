import { StyleSheet } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import React from "react";

export default function TabTwoScreen() {
  return (
    <>
      <View style={styles.titleContainer}>
        <Text>Explore</Text>
      </View>
      <Text>This app includes example code to help you get started.</Text>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{" "}
          library to create a waving hand animation.
        </Text>
      </Collapsible>
    </>
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
    flexDirection: "row",
    gap: 8,
  },
});
