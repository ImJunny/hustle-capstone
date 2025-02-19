import React from "react";
import { FlatList, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Device from "expo-device";

const useFeedHeight = () => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = Dimensions.get("window");
  const insetTop = Device.brand === "google" ? 0 : insets.top;
  return windowHeight - 66 - 56 - insetTop - insets.bottom;
};

interface FeedListProps<T> {
  data: T[];
  renderItem: ({ item }: { item: T }) => JSX.Element;
}

const FeedList = <T extends { uuid: string }>({
  data,
  renderItem,
}: FeedListProps<T>) => {
  const feedHeight = useFeedHeight();
  return (
    <FlatList
      bounces={false}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.uuid}
      pagingEnabled
      snapToInterval={feedHeight}
      snapToAlignment="end"
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      getItemLayout={(data, index) => ({
        length: feedHeight,
        offset: feedHeight * index,
        index,
      })}
      snapToEnd
    />
  );
};

export default FeedList;
