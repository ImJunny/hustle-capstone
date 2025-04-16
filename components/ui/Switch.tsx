import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Animated } from "react-native";
import View from "./View";
import Text from "./Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TouchableOpacityProps } from "react-native-gesture-handler";

type SwitchProps = {
  selected?: boolean;
  onValueChange?: (value: boolean) => void;
} & TouchableOpacityProps;

export default function Switch({
  selected = false,
  onValueChange,
  ...props
}: SwitchProps) {
  const themeColor = useThemeColor();
  const [isOn, setIsOn] = useState(selected);
  const [animatedValue] = useState(new Animated.Value(selected ? 1 : 0));

  const toggleSwitch = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    Animated.timing(animatedValue, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onValueChange?.(newValue);
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 28],
  });

  return (
    <TouchableOpacity
      onPress={toggleSwitch}
      style={styles.container}
      {...props}
    >
      <View
        style={[
          styles.track,
          {
            backgroundColor: isOn
              ? themeColor["background-variant"]
              : themeColor.background,
            borderWidth: 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
              backgroundColor: themeColor.foreground,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  track: {
    width: 55,
    height: 24,
    borderRadius: 999,
    justifyContent: "center",
    padding: 0,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 999,
  },
  label: {
    marginLeft: 8,
  },
});
