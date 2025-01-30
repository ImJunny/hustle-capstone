// This file is a fallback for using MaterialIcons on Android and web.

import { Ionicons } from "@expo/vector-icons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import {
  OpaqueColorValue,
  StyleProp,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { IconSizes, TIconSizes } from "@/constants/Sizes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";

type IconSymbolName = React.ComponentProps<typeof Ionicons>["name"];
type IconButtonProps = {
  name: IconSymbolName;
  size?: TIconSizes;
  color?: TColors;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
  onPress?: () => void;
};

export default function IconButton({
  name,
  size = "md",
  color = "foreground",
  style,
  onPress,
}: IconButtonProps) {
  const iconColor = useThemeColor(color);

  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons
        name={name}
        style={[{ fontSize: IconSizes[size] }, style]}
        color={iconColor}
      />
    </TouchableOpacity>
  );
}
