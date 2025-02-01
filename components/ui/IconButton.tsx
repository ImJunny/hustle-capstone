import { Ionicons } from "@expo/vector-icons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { IconSizes, TIconSizes } from "@/constants/Sizes";
import { TColors } from "@/constants/Colors";
import Icon from "./Icon";

type IconSymbolName = React.ComponentProps<typeof Ionicons>["name"];
type IconButtonProps = {
  name: IconSymbolName;
  size?: TIconSizes;
  color?: TColors;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
} & TouchableOpacityProps;

export default function IconButton({
  name,
  size = "xl",
  color = "foreground",
  style,
  ...props
}: IconButtonProps) {
  return (
    <TouchableOpacity {...props}>
      <Icon size={size} name={name} style={[style]} color={color} />
    </TouchableOpacity>
  );
}
