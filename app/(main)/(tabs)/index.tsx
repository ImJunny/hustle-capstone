import { FlatList, Dimensions, StatusBar } from "react-native";
import Feed from "@/components/ui/Feed";
import React from "react";
import { IndexHeader } from "@/components/headers/Headers";
import { exampleJobPosts, exampleHirePosts } from "@/server/utils/example_data";
import View from "@/components/ui/View";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = Dimensions.get("window");
  const insetTop = Device.brand === "google" ? 0 : insets.top;
  const feedHeight = windowHeight - 66 - 56 - insetTop - insets.bottom;

  return (
    <>
      <IndexHeader />
      <View style={{ flex: 1 }}>
        <FlatList
          bounces={false}
          data={exampleJobPosts}
          renderItem={({ item }) => <Feed key={item.uuid} data={item} />}
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
      </View>
    </>
  );
}
