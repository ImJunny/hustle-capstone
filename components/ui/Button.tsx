import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewProps,
} from "react-native";
import { TColors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import Text from "./Text";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  type?: "primary" | "secondary" | "variant" | "outline";
  isFullWidth?: boolean;
} & TouchableOpacityProps;

export default function Button({
  children,
  type = "primary",
  isFullWidth,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const themeColor = useThemeColor();

  const backgroundColor =
    type === "primary"
      ? themeColor["foreground"]
      : type === "secondary" || type === "outline"
      ? themeColor["background"]
      : themeColor["background-variant"];

  const textColor = type === "primary" ? "background" : "foreground";
  const borderColor = type === "outline" ? themeColor["border"] : "transparent";
  const borderWidth = type === "outline" ? 1 : 0;

  // If child is a string, use predefined Text component. Otherwise, use children as is.
  const processChildren = React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return (
        <Text color={textColor} weight="semibold">
          {child}
        </Text>
      );
    } else {
      return child;
    }
  });

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      style={[
        styles.buttonContainer,
        {
          opacity: disabled ? 0.5 : 1,
          backgroundColor: backgroundColor,
          alignSelf: isFullWidth ? "stretch" : "auto",
          borderColor,
          borderWidth,
        },
        style,
      ]}
    >
      {processChildren}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
});
