import React from "react";
import Post from "./Post";
import { trpc } from "@/server/lib/trpc-client";
import Skeleton from "../ui/Skeleton";
import { Post as TPost } from "@/server/actions/post-actions";

export default function LoadingPost({ uuid }: { uuid: string }) {
  const { data, isLoading } = trpc.post.get_post_info.useQuery({ uuid });

  if (!data) return;
  return (
    <Skeleton show={isLoading}>
      <Post
        data={{ ...data, distance: null } as TPost}
        style={{ height: "auto", paddingHorizontal: 0 }}
      />
    </Skeleton>
  );
}
