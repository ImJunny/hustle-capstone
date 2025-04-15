import React from "react";
import ScrollView from "../ui/ScrollView";
import { Post as TPost } from "@/server/actions/post-actions";
import Post from "./Post";

export default function PostList({ data }: { data: TPost[] }) {
  return (
    <ScrollView>
      {data.map((post, i) => (
        <Post
          key={i}
          data={post}
          style={{
            borderBottomWidth: 1,
          }}
        />
      ))}
    </ScrollView>
  );
}
