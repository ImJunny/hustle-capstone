import { FlatList, Dimensions, RefreshControl } from "react-native";
import React from "react";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomePost from "./HomePost";
import { HomePost as THomePost } from "@/server/actions/post-actions";
import { QueryObserverResult } from "@tanstack/react-query";

const useFeedHeight = () => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = Dimensions.get("window");
  const insetTop = Device.brand === "google" ? 0 : insets.top;
  return windowHeight - 66 - 56 - insetTop - insets.bottom;
};

interface FeedListProps<T> {
  data: T[];
  refetch: QueryObserverResult["refetch"];
}

const Feed = <T extends { uuid: string }>({
  data,
  refetch,
}: FeedListProps<T>) => {
  const postHeight = useFeedHeight();

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, []);

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      bounces={false}
      data={data}
      renderItem={({ item }) => (
        <HomePost data={item as unknown as THomePost} />
      )}
      keyExtractor={(item, index) => `${item.uuid}-${index}`}
      pagingEnabled
      snapToInterval={postHeight}
      snapToAlignment="end"
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      getItemLayout={(data, index) => ({
        length: postHeight,
        offset: postHeight * index,
        index,
      })}
      snapToEnd
    />
  );
};

export default React.memo(Feed);
