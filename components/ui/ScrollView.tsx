import {
  ScrollView as NativeScrollView,
  type ScrollViewProps as NativeScrollViewProps,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";

export type ViewProps = {
  color?: TColors;
} & NativeScrollViewProps;

export default function ScrollView({
  style,
  color = "transparent",
  ...otherProps
}: ViewProps) {
  const backgroundColor = useThemeColor()[color];

  return (
    <NativeScrollView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}
