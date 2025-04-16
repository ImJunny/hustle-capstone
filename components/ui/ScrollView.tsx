import React, { forwardRef, useState } from "react";
import {
  ScrollView as NativeScrollView,
  RefreshControl,
  type ScrollViewProps as NativeScrollViewProps,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";
import { QueryObserverResult } from "@tanstack/react-query";

export type ScrollViewProps = {
  color?: TColors;
  refetch?: QueryObserverResult["refetch"];
  showsVerticalScrollIndicator?: boolean;
} & NativeScrollViewProps;

const ScrollView = forwardRef<NativeScrollView, ScrollViewProps>(
  (
    {
      style,
      color = "transparent",
      bounces = false,
      refetch,
      showsVerticalScrollIndicator = false,
      ...otherProps
    },
    ref
  ) => {
    const backgroundColor = useThemeColor()[color];

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      refetch && refetch().then(() => setRefreshing(false));
    }, []);

    return (
      <NativeScrollView
        ref={ref}
        style={[{ backgroundColor }, style]}
        bounces={true}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          refetch ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        {...otherProps}
      />
    );
  }
);

export default ScrollView;
