import PostList from "@/components/posts/PostList";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { exampleJobPosts } from "@/server/utils/example-data";

export default function SavedJobsScreen() {
  return <PostList data={exampleJobPosts} />;
}
