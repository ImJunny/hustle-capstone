import React from "react";
import { exampleJobPosts } from "@/server/utils/example_data";
import Post from "@/components/posts/Post";
import ScrollView from "@/components/ui/ScrollView";
import ExploreMiniHeader from "@/components/explore/ExploreMiniHeader";

export default function searchedJobs() {
  return (
    <>
      <ExploreMiniHeader />
      <ScrollView>
        {exampleJobPosts.map((post, i) => (
          <Post
            key={i}
            data={post}
            style={{
              borderTopWidth: i == 0 ? 1 : 0,
              borderBottomWidth: 1,
            }}
          />
        ))}
      </ScrollView>
    </>
  );
}
