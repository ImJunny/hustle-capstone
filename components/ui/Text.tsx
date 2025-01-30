import {
  Text as NativeText,
  type TextProps,
  StyleSheet,
  TextStyle,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";
import { FontSizes, TFontSizes } from "@/constants/Sizes";

export type ThemedTextProps = TextProps & {
  color?: TColors;
  size?: TFontSizes;
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
        {
          color: textColor,
          fontSize: FontSizes[size],
          fontFamily: `Inter${weight}`,
        },
        style,
      ]}
      {...rest}
    />
  );
}
