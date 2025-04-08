import React, { forwardRef, useState } from "react";
import {
  FlatList as NativeFlatList,
  RefreshControl,
  type FlatListProps as NativeFlatListProps,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { TColors } from "@/constants/Colors";
import { QueryObserverResult } from "@tanstack/react-query";

export type FlatListProps<ItemT> = {
  color?: TColors;
  refetch?: QueryObserverResult["refetch"];
} & NativeFlatListProps<ItemT>;

const FlatList = forwardRef<NativeFlatList, FlatListProps<any>>(
  ({ style, color = "transparent", refetch, ...otherProps }, ref) => {
    const backgroundColor = useThemeColor()[color];

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      refetch && refetch().then(() => setRefreshing(false));
    }, []);

    return (
      <NativeFlatList
        ref={ref}
        style={[{ backgroundColor }, style]}
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

export default FlatList;
