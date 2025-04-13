import { Dimensions } from "react-native";
import Feed from "@/components/posts/Feed";
import React, { useState, useEffect } from "react";
import { IndexHeader } from "@/components/headers/Headers";
import { TabView } from "react-native-tab-view";
import { trpc } from "@/server/lib/trpc-client";
import { useAuthData } from "@/contexts/AuthContext";
import { usePostStore } from "@/hooks/usePostStore";
import CommentsSheet from "@/components/posts/CommentsSheet";
import SharePostSheet from "@/components/posts/SharePostSheet";

interface Route {
  key: string;
  title: string;
}

const useFetchPosts = (type: "work" | "hire") => {
  const { user, geocode } = useAuthData();
  const { data: posts, refetch } = trpc.post.get_home_posts.useQuery({
    type,
    user_uuid: user?.id,
    geocode: geocode ?? undefined,
  });

  const savePost = usePostStore((state) => state.savePost);

  useEffect(() => {
    if (posts) {
      posts.forEach((post) => {
        if (post.is_liked) {
          savePost(post.uuid);
        }
      });
    }
  }, [posts]);

  return { posts, refetch };
};

const WorkRoute = () => {
  const { posts, refetch } = useFetchPosts("work");
  return <Feed data={posts!} refetch={refetch} />;
};

const HireRoute = () => {
  const { posts, refetch } = useFetchPosts("hire");
  return <Feed data={posts!} refetch={refetch} />;
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
        renderTabBar={() => null}
      />
    </>
  );
}
