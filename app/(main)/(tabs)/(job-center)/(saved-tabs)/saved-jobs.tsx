import { getSavedPosts } from "@/server/actions/post-actions";
import PostList from "@/components/posts/PostList";
import { useAuthData } from "@/contexts/AuthContext";

export default async function SavedJobsScreen() {
  const session = await useAuthData();

  if (!session?.user?.id) {
    return <PostList data={[]} />;
  }

  const savedJobs = await getSavedPosts(session.user.id, "work");

  return <PostList data={savedJobs} />;
}
