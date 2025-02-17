import PostList from "@/components/posts/PostList";
import { exampleServicePosts } from "@/server/utils/example-data";

export default function SavedJobsScreen() {
  return <PostList data={exampleServicePosts} />;
}
