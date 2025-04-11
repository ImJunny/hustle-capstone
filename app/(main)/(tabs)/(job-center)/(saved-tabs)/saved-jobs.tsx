import { useAuthData } from "@/contexts/AuthContext";
import ScrollView from "@/components/ui/ScrollView";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import LoadingView from "@/components/ui/LoadingView";
import { trpc } from "@/server/lib/trpc-client";
import Post from "@/components/posts/Post";
import { Post as TPost } from "@/server/actions/post-actions";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function SavedJobsScreen() {
  const { user } = useAuthData();
  const {
    data: savedJobs,
    isLoading,
    error,
    refetch,
  } = trpc.post.get_saved_posts.useQuery({
    user_uuid: user?.id || "",
    type: "work",
  });

  if (isLoading || error || !savedJobs) {
    return (
      <LoadingScreen refetch={refetch} data={savedJobs} loads={isLoading} />
    );
  }

  if (!savedJobs || savedJobs.length === 0) {
    return (
      <ScrollView
        refetch={refetch}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>No saved jobs found</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView refetch={refetch}>
      {savedJobs.map((post, i) => (
        <Post key={i} data={post as TPost} type={post.type} />
      ))}
    </ScrollView>
  );
}
