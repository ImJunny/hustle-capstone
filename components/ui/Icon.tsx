// This file is a fallback for using MaterialIcons on Android and web.

import { TColors } from "@/constants/Colors";
import { IconSizes, TIconSizes } from "@/constants/Sizes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";
import { ViewProps } from "./View";

export type IconSymbolName = React.ComponentProps<typeof Ionicons>["name"];
type IconProps = {
  name: IconSymbolName;
  size?: TIconSizes | number;
  color?: TColors;
  weight?: SymbolWeight;
  flippedX?: boolean;
} & ViewProps;

export default function Icon({
  name,
  size = "md",
  color = "foreground",
  flippedX,
  style,
}: IconProps) {
  const themeColor = useThemeColor();

  const iconSize = typeof size === "number" ? size : IconSizes[size];
  return (
    <Ionicons
      name={name}
      style={[
        flippedX && { transform: [{ scaleX: -1 }] },
        { fontSize: iconSize },
        style,
      ]}
      color={themeColor[color]}
    />
  );
}
