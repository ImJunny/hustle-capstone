import React from "react";
import ScrollView from "../ui/ScrollView";
import { TPost } from "@/server/utils/example-data";
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
