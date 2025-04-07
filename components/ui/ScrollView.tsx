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
} & NativeScrollViewProps;

const ScrollView = forwardRef<NativeScrollView, ScrollViewProps>(
  (
    { style, color = "transparent", bounces = false, refetch, ...otherProps },
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
        bounces={bounces}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          refetch ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="transparent"
              colors={["transparent"]}
            />
          ) : undefined
        }
        {...otherProps}
      />
    );
  }
);

export default ScrollView;
