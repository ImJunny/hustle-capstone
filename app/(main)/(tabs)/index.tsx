import { Dimensions } from "react-native";
import Feed from "@/components/ui/Feed";
import HireFeed from "@/components/ui/HireFeed";
import React, { useState } from "react";
import { IndexHeader } from "@/components/headers/Headers";
import { exampleJobPosts, exampleHirePosts } from "@/server/utils/example_data";
import View from "@/components/ui/View";
import { TabView, SceneMap } from "react-native-tab-view";
import FeedList from "@/components/ui/FeedList";

interface Route {
  key: string;
  title: string;
}

const WorkRoute = () => (
  <FeedList
    data={exampleJobPosts}
    renderItem={({ item }) => <Feed key={item.uuid} data={item} />}
  />
);

const HireRoute = () => (
  <FeedList
    data={exampleHirePosts}
    renderItem={({ item }) => <HireFeed key={item.uuid} data={item} />}
  />
);

const renderScene = ({ route }: { route: Route }) => {
  switch (route.key) {
    case "work":
      return <WorkRoute />;
    case "hire":
      return <HireRoute />;
    default:
      return null;
  }
};

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "work", title: "Work" },
    { key: "hire", title: "Hire" },
  ]);

  return (
    <>
      <View style={{ flex: 1 }}>
        <IndexHeader index={index} setIndex={setIndex} />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get("window").width }}
          renderTabBar={() => null} // Hide the default tab bar
        />
      </View>
    </>
  );
}
