// This file is a fallback for using MaterialIcons on Android and web.

import { TColors } from "@/constants/Colors";
import { IconSizes, TIconSizes } from "@/constants/Sizes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

type IconSymbolName = React.ComponentProps<typeof Ionicons>["name"];
type IconProps = {
  name: IconSymbolName;
  size?: TIconSizes;
  color?: TColors;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
};

export default function Icon({
  name,
  size = "md",
  color = "foreground",
  style,
}: IconProps) {
  const themeColor = useThemeColor();

  return (
    <Ionicons
      name={name}
      style={[{ fontSize: IconSizes[size] }, style]}
      color={themeColor[color]}
    />
  );
}
