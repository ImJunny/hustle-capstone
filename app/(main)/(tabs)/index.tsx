import { StyleSheet, FlatList, Dimensions, StatusBar } from "react-native";
import Feed from "@/components/ui/Feed";
import React from "react";
import { ExampleHeader } from "@/components/headers/Headers";
import { exampleJobPosts } from "@/server/utils/example_data";
import View from "@/components/ui/View";
import { useAuthInfo } from "@/contexts/AuthContext";

export default function HomeScreen() {
  const { height: totalHeight } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight || 0;
  const subtractedHeight = 66 + 56 + statusBarHeight;
  const newHeight = totalHeight - subtractedHeight;

  const { user } = useAuthInfo();
  console.log("user from home is ", user?.id);
  return (
    <>
      <ExampleHeader />
      <View style={{ flex: 1 }}>
        <FlatList
          data={exampleJobPosts}
          renderItem={({ item }) => <Feed key={item.uuid} data={item} />}
          keyExtractor={(item) => item.uuid}
          pagingEnabled
          snapToInterval={newHeight}
          snapToAlignment="end"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => ({
            length: newHeight,
            offset: newHeight * index,
            index,
          })}
        />
      </View>
    </>
  );
}
