import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  color?:
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: "light" | "normal" | "semibold" | "bold";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  color = "background",
  size = "md",
  weight = "normal",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, color);

  console.log(darkColor);
  return <Text style={[{ color }, styles[size], style]} {...rest} />;
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
