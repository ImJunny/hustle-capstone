import { Dimensions } from "react-native";
import HomePost from "@/components/posts/HomePost";
import Feed from "@/components/posts/Feed";
import React, { useState } from "react";
import { IndexHeader } from "@/components/headers/Headers";
import View from "@/components/ui/View";
import { TabView } from "react-native-tab-view";
import { trpc } from "@/server/lib/trpc-client";
import { HomePost as THomePost } from "@/server/actions/post-actions";

interface Route {
  key: string;
  title: string;
}

const WorkRoute = () => {
  const { data: workPosts } = trpc.post.get_home_posts.useQuery({
    type: "work",
  });

  return (
    <Feed
      data={workPosts!}
      renderItem={({ item }) => (
        <HomePost data={item as unknown as THomePost} />
      )}
    />
  );
};

const HireRoute = () => {
  const { data: hirePosts } = trpc.post.get_home_posts.useQuery({
    type: "hire",
  });

  return (
    <Feed
      data={hirePosts!}
      renderItem={({ item }) => (
        <HomePost data={item as unknown as THomePost} />
      )}
    />
  );
};

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
