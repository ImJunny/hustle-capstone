import { getSavedPosts } from "@/server/actions/post-actions";
import PostList from "@/components/posts/PostList";
import { useAuthData } from "@/contexts/AuthContext";

export default async function SavedServicesScreen() {
  const session = await useAuthData();

  if (!session?.user?.id) {
    return <PostList data={[]} />;
  }

  const savedServices = await getSavedPosts(session.user.id, "hire");

  return <PostList data={savedServices} />;
}
