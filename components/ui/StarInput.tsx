import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import View from "./View";
import Icon from "./Icon";

export default function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const onPress = (index: number) => {
    onChange(index + 1);
  };

  return (
    <View style={styles.starContainer}>
      {[...Array(5)].map((_, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.6}
          onPress={() => onPress(index)}
        >
          <Icon
            key={index}
            name={index <= value - 1 ? "star" : "star-outline"}
            size="2xl"
            color="foreground"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
