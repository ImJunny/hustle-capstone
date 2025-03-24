import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import View from "./View";
import Text from "./Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TouchableOpacityProps } from "react-native-gesture-handler";

type RadioButtonProps = {
  selected?: any;
  value?: any;
  onPress?: (value: string) => void;
  label?: string;
} & TouchableOpacityProps;

export default function ({
  selected,
  value,
  onPress,
  label,
  ...props
}: RadioButtonProps) {
  const themeColor = useThemeColor();
  const borderColor = themeColor.foreground;
  return (
    <TouchableOpacity
      style={styles.radioButtonContainer}
      onPress={onPress && value ? () => onPress(value) : () => {}}
      {...props}
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
      {label && <Text style={styles.label}>{label}</Text>}
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
