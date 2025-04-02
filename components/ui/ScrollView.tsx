import {
  ScrollView as NativeScrollView,
  type ScrollViewProps as NativeScrollViewProps,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";

export type ScrollViewProps = {
  color?: TColors;
  ref?: React.Ref<NativeScrollView>;
} & NativeScrollViewProps;

export default function ScrollView({
  style,
  color = "transparent",
  bounces = false,
  ref,
  ...otherProps
}: ScrollViewProps) {
  const backgroundColor = useThemeColor()[color];

  return (
    <NativeScrollView
      ref={ref}
      style={[{ backgroundColor }, style]}
      bounces={bounces}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...otherProps}
    />
  );
}
