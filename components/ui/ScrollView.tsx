import React, { forwardRef } from "react";
import {
  ScrollView as NativeScrollView,
  type ScrollViewProps as NativeScrollViewProps,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";

export type ScrollViewProps = {
  color?: TColors;
} & NativeScrollViewProps;

// Use forwardRef to correctly pass the ref
const ScrollView = forwardRef<NativeScrollView, ScrollViewProps>(
  ({ style, color = "transparent", bounces = false, ...otherProps }, ref) => {
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
);

export default ScrollView;
