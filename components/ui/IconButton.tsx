import { Ionicons } from "@expo/vector-icons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { TIconSizes } from "@/constants/Sizes";
import { TColors } from "@/constants/Colors";
import Icon, { IconSymbolName } from "./Icon";

type IconButtonProps = {
  name: IconSymbolName;
  size?: TIconSizes | number;
  color?: TColors;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
  flippedX?: boolean;
  hideOpacity?: boolean;
} & TouchableOpacityProps;

export default function IconButton({
  name,
  size = "xl",
  color = "foreground",
  flippedX,
  hideOpacity,
  disabled,
  style,
  ...props
}: IconButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={hideOpacity ? 1 : 0.2}
      style={[{ opacity: disabled ? 0.2 : 1 }, style]}
      {...props}
    >
      <Icon size={size} name={name} color={color} flippedX={flippedX} />
    </TouchableOpacity>
  );
}
