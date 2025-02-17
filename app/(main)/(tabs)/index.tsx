import { FlatList, Dimensions } from "react-native";
import HomePost from "@/components/posts/HomePost";
import React from "react";
import { IndexHeader } from "@/components/headers/Headers";
import { exampleJobPosts } from "@/server/utils/example_data";
import View from "@/components/ui/View";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = Dimensions.get("window");
  const insetTop = Device.brand === "google" ? 0 : insets.top;
  const postHeight = windowHeight - 66 - 56 - insetTop - insets.bottom;

  return (
    <>
      <IndexHeader />
      <View style={{ flex: 1 }}>
        <FlatList
          bounces={false}
          data={exampleJobPosts}
          renderItem={({ item }) => <HomePost key={item.uuid} data={item} />}
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
      </View>
    </>
  );
}
