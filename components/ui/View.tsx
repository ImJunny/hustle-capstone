import {
  View as NativeView,
  type ViewProps as NativeViewProps,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";

export type ViewProps = {
  color?: TColors;
} & NativeViewProps;

export default function View({
  style,
  color = "transparent",
  ...otherProps
}: ViewProps) {
  const backgroundColor = useThemeColor()[color];
  const themeColor = useThemeColor();

  return (
    <NativeView
      style={[{ backgroundColor, borderColor: themeColor.border }, style]}
      {...otherProps}
    />
  );
}
