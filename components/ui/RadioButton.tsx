import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import View from "./View";
import Text from "./Text";
import { useThemeColor } from "@/hooks/useThemeColor";

type RadioButtonProps = {
  selected?: string;
  value?: string;
  onPress?: (value: string) => void;
  label: string;
};

export default function ({
  selected,
  value,
  onPress,
  label,
}: RadioButtonProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.foreground;
  return (
    <TouchableOpacity
      style={styles.radioButtonContainer}
      onPress={onPress && value ? () => onPress(value) : () => {}}
    >
      <View style={[styles.radioButton, { borderColor }]}>
        <View
          style={[
            styles.radioButtonInner,
            {
              backgroundColor:
                selected == value ? themeColor.foreground : "transparent",
            },
          ]}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    borderRadius: 999,
    borderWidth: 2,
  },
  radioButtonInner: {
    borderRadius: 999,
    width: 16,
    height: 16,
    margin: 2,
  },
  label: {
    marginLeft: 12,
  },
});
