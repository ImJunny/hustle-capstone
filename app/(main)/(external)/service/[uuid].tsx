import React from "react";
import { useLocalSearchParams } from "expo-router";

import PostDetails from "@/components/posts/PostDetails";

export default function PostScreen() {
  const { uuid } = useLocalSearchParams();

  return <PostDetails uuid={uuid as string} />;
}
