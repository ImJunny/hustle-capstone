import { StyleSheet, TextInput, TextInputProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";
import { FontSizes } from "@/constants/Sizes";

export type InputProps = {
  color?: TColors;
  type?: "default" | "outline" | "clear";
  placeholder?: string;
} & TextInputProps;

export default function Input({
  style,
  type = "default",
  placeholder,
  ...props
}: InputProps) {
  const themeColor = useThemeColor();
  const backgroundColor =
    type === "default" ? themeColor["background-variant"] : "transparent";
  const textColor = themeColor.foreground;
  const placeholderColor = themeColor.muted;
  const borderColor = themeColor.foreground;
  const borderWidth = type === "outline" ? 1 : 0;

  return (
    <TextInput
      placeholder={placeholder}
      style={[
        {
          backgroundColor,
          color: textColor,
          borderColor,
          borderWidth,
          fontSize: FontSizes.md,
          fontWeight: "normal",
        },
        styles.inputContainer,
        style,
      ]}
      placeholderTextColor={placeholderColor}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: "center",
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontFamily: "Inter-normal",
  },
});
