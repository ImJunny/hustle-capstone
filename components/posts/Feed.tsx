import { FlatList, Dimensions } from "react-native";
import HomePost from "@/components/posts/HomePost";
import React from "react";
import { IndexHeader } from "@/components/headers/Headers";
import { exampleJobPosts } from "@/server/utils/example-data";
import View from "@/components/ui/View";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  
  const Feed = <T extends { uuid: string }>({
    data,
    renderItem,
  }: FeedListProps<T>) => {
    const postHeight = useFeedHeight();
    return (
      <FlatList
        bounces={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.uuid}
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
  
  export default Feed;