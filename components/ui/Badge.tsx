import { StyleSheet, ViewProps } from "react-native";
import View from "@/components/ui/View";
import Text from "./Text";
import React from "react";

export default function Badge({ children, style }: ViewProps) {
  // If child is a string, use predefined Text component. Otherwise, use children as is.
  const processChildren = React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return <Text weight="semibold">{child}</Text>;
    } else {
      return child;
    }
  });

  return (
    <View style={[styles.badgeContainer, style]} color="background-variant">
      {processChildren}
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
});
