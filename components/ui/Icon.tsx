// This file is a fallback for using MaterialIcons on Android and web.

import { Ionicons } from "@expo/vector-icons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

type IconSymbolName = React.ComponentProps<typeof Ionicons>["name"];

export default function Icon({
  name,
  size = "md",
  color = "black",
  style,
}: {
  name: IconSymbolName;
  size?: keyof typeof iconSizeStyles;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <Ionicons name={name} style={[iconSizeStyles[size], style]} color={color} />
  );
}

const iconSizeStyles = {
  xs: {
    fontSize: 12,
  },
  sm: {
    fontSize: 16,
  },
  md: {
    fontSize: 28,
  },
  lg: {
    fontSize: 40,
  },
  xl: {
    fontSize: 44,
  },
};
