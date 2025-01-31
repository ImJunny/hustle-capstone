import { Ionicons } from "@expo/vector-icons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { IconSizes, TIconSizes } from "@/constants/Sizes";
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
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons
        name={name}
        style={[{ fontSize: IconSizes[size] }, style]}
        color={color}
      />
    </TouchableOpacity>
  );
}
