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
  size?: TIconSizes;
  color?: TColors;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
  flippedX?: boolean;
} & TouchableOpacityProps;

export default function IconButton({
  name,
  size = "xl",
  color = "foreground",
  flippedX,
  style,
  ...props
}: IconButtonProps) {
  return (
    <TouchableOpacity {...props}>
      <Icon
        size={size}
        name={name}
        style={[flippedX && { transform: "scaleX(-1)" }, style]}
        color={color}
      />
    </TouchableOpacity>
  );
}
