import { Dimensions } from "react-native";
import Feed from "@/components/posts/Feed";
import React, { useState } from "react";
import { IndexHeader } from "@/components/headers/Headers";
import { TabView } from "react-native-tab-view";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";

interface Route {
  key: string;
  title: string;
}

const WorkRoute = () => {
  const { user } = useAuthData();
  const { data: workPosts, refetch } = trpc.post.get_home_posts.useQuery({
    type: "work",
    user_uuid: user?.id,
  });

  return <Feed data={workPosts!} refetch={() => refetch().then(() => {})} />;
};

const HireRoute = () => {
  const { user } = useAuthData();
  const { data: hirePosts, refetch } = trpc.post.get_home_posts.useQuery({
    type: "hire",
    user_uuid: user?.id,
  });

  return <Feed data={hirePosts!} refetch={() => refetch().then(() => {})} />;
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
      <IndexHeader index={index} setIndex={setIndex} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={() => null} // Hide the default tab bar
      />
    </>
  );
}
