import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

export type ThemedTextProps = TextProps & {
  color?: keyof typeof Colors.light & keyof typeof Colors.dark;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: "light" | "normal" | "semibold" | "bold";
};

export function ThemedText({
  style,
  color = "background",
  size = "md",
  weight = "normal",
  ...rest
}: ThemedTextProps) {
  const textColor = useThemeColor(color);
  return <Text style={[{ color:textColor }, styles[size], style]} {...rest} />;
}

const styles = StyleSheet.create({
  xs: {
    fontSize: 12,
  },
  sm: {
    fontSize: 14,
  },
  md: {
    fontSize: 16,
  },
  lg: {
    fontSize: 18,
  },
  xl: {
    fontSize: 20,
  },
});
