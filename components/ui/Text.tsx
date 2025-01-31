import { Text as NativeText, type TextProps } from "react-native";

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
  ...props
}: ThemedTextProps) {
  const themeColor = useThemeColor();
  return (
    <NativeText
      style={[
        {
          color: themeColor[color],
          fontSize: FontSizes[size],
          fontFamily: `Inter-${weight}`,
        },
        style,
      ]}
      {...props}
    />
  );
}
