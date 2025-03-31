import React, { ForwardedRef, ReactNode } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";
import { FontSizes } from "@/constants/Sizes";

export type InputProps = {
  color?: TColors;
  borderColor?: TColors;
  type?: "default" | "outline" | "clear" | "line";
  placeholder?: string;
  children?: ReactNode;
} & TextInputProps;

function Input(
  {
    style,
    borderColor,
    type = "default",
    placeholder,
    children,
    ...props
  }: InputProps,
  ref: ForwardedRef<TextInput>
) {
  const themeColor = useThemeColor();
  const backgroundColor =
    type === "default" ? themeColor["background-variant"] : "transparent";
  const textColor = themeColor.foreground;
  const placeholderColor = themeColor.muted;
  const borderColorr = borderColor
    ? themeColor[borderColor]
    : themeColor.foreground;
  const paddingHorizontal = type === "line" || type === "clear" ? 0 : 12;
  const borderRadius = type === "line" ? 0 : 6;
  const borderBottomWidth = type === "clear" || type === "default" ? 0 : 1;
  const borderLeftWidth =
    type === "line" || type === "clear" || type === "default" ? 0 : 1;
  const borderTopWidth =
    type === "line" || type === "clear" || type === "default" ? 0 : 1;
  const borderRightWidth =
    type === "line" || type === "clear" || type === "default" ? 0 : 1;

  return (
    <TextInput
      ref={ref} // Pass the ref down to the TextInput component
      placeholder={placeholder}
      style={[
        {
          paddingHorizontal,
          backgroundColor,
          color: textColor,
          borderRadius,
          borderColor: borderColorr,
          borderBottomWidth,
          borderRightWidth,
          borderTopWidth,
          borderLeftWidth,
          fontSize: FontSizes.md,
          fontWeight: "normal",
        },
        styles.inputContainer,
        style,
      ]}
      placeholderTextColor={placeholderColor}
      {...props}
    >
      {children}
    </TextInput>
  );
}

export default React.forwardRef(Input);

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: "center",
    height: 40,
    fontFamily: "Inter-normal",
  },
});
