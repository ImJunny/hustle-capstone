import {
  Text as NativeText,
  type TextProps,
  StyleSheet,
  TextStyle,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";

export type ThemedTextProps = TextProps & {
  color?: TColors;
  size?: keyof typeof fontSizeStyles;
  weight?: "normal" | "semibold" | "bold";
};

export default function Text({
  style,
  color = "foreground",
  size = "md",
  weight = "normal",
  ...rest
}: ThemedTextProps) {
  const textColor = useThemeColor(color);
  return (
    <NativeText
      style={[
        { color: textColor, fontFamily: `Inter_${weight}` },
        fontSizeStyles[size],
        style,
      ]}
      {...rest}
    />
  );
}

const fontSizeStyles = StyleSheet.create({
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
  "2xl": {
    fontSize: 24,
  },
});
