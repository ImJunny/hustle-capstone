import { FlatList, Dimensions, StatusBar } from "react-native";
import Feed from "@/components/ui/Feed";
import HireFeed from "@/components/ui/HireFeed";
import React, { useState } from "react";
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

  const [showFeed, setShowFeed] = useState(true);

  return (
    <>
      <IndexHeader
        onShowWork={() => setShowFeed(true)}
        onShowHire={() => setShowFeed(false)}
        showFeed={showFeed}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          bounces={false}
          data={showFeed ? exampleJobPosts : exampleHirePosts}
          renderItem={({ item }) =>
            showFeed ? (
              <Feed key={item.uuid} data={item} />
            ) : (
              <HireFeed key={item.uuid} data={item} />
            )
          }
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
