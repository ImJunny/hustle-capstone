import React from "react";
import PostList from "@/components/posts/PostList";
import { exampleJobPosts } from "@/server/utils/example_data";
import { SimpleHeader } from "@/components/headers/Headers";

export default function RecentlyViewedScreen() {
  return (
    <>
      <SimpleHeader title="Recently viewed" />
      <PostList data={exampleJobPosts} />
    </>
  );
}
