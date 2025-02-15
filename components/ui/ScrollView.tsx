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
  bounces = false,
  ...otherProps
}: ViewProps) {
  const backgroundColor = useThemeColor()[color];

  return (
    <NativeScrollView
      style={[{ backgroundColor }, style]}
      bounces={bounces}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...otherProps}
    />
  );
}
