import { FlatList, Dimensions } from "react-native";
import HomePost from "@/components/posts/HomePost";
import WorkPost from "@/components/posts/WorkPost";
import Feed from "@/components/posts/Feed";
import React, {useState} from "react";
import { IndexHeader } from "@/components/headers/Headers";
import { exampleJobPosts, exampleServicePosts } from "@/server/utils/example-data";
import View from "@/components/ui/View";
import { TabView, SceneMap } from "react-native-tab-view";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Route {
  key: string;
  title: string;
}

const WorkRoute = () => (
  <Feed
    data={exampleJobPosts}
    renderItem={({ item }) => <HomePost key={item.uuid} data={item} />}
  />
);

const HireRoute = () => (
  <Feed
    data={exampleServicePosts}
    renderItem={({ item }) => <WorkPost key={item.uuid} data={item} />}
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
